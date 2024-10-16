import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ChainlinkToken,
  Transfer as TransferEvent,
  Approval as ApprovalEvent
} from "../generated/ChainlinkToken/ChainlinkToken"
import { Token, Transfer, Approval, Holder, DailyVolume } from "../generated/schema"

function getOrCreateToken(address: Address): Token {
  let token = Token.load(address.toHexString())
  if (!token) {
    token = new Token(address.toHexString())
    let contract = ChainlinkToken.bind(address)
    token.name = contract.name()
    token.symbol = contract.symbol()
    token.decimals = contract.decimals()
    token.totalSupply = contract.totalSupply()
    token.save()
  }
  return token as Token
}

function getOrCreateHolder(address: Address, token: Token): Holder {
  let id = token.id + '-' + address.toHexString()
  let holder = Holder.load(id)
  if (!holder) {
    holder = new Holder(id)
    holder.address = address
    holder.balance = BigInt.fromI32(0)
    holder.token = token.id
    holder.save()
  }
  return holder as Holder
}

function updateDailyVolume(token: Token, amount: BigInt, timestamp: BigInt): void {
  let day = timestamp.toI32() / 86400
  let id = token.id + '-' + day.toString()
  let dailyVolume = DailyVolume.load(id)
  if (!dailyVolume) {
    dailyVolume = new DailyVolume(id)
    dailyVolume.date = (day * 86400).toString()
    dailyVolume.volume = BigInt.fromI32(0)
    dailyVolume.token = token.id
  }
  dailyVolume.volume = dailyVolume.volume.plus(amount)
  dailyVolume.save()
}

export function handleTransfer(event: TransferEvent): void {
  let token = getOrCreateToken(event.address)
  let from = getOrCreateHolder(event.params.from, token)
  let to = getOrCreateHolder(event.params.to, token)

  from.balance = from.balance.minus(event.params.value)
  to.balance = to.balance.plus(event.params.value)

  from.save()
  to.save()

  let transfer = new Transfer(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.value = event.params.value
  transfer.timestamp = event.block.timestamp
  transfer.block = event.block.number
  transfer.token = token.id
  transfer.save()

  updateDailyVolume(token, event.params.value, event.block.timestamp)
}

export function handleApproval(event: ApprovalEvent): void {
  let token = getOrCreateToken(event.address)
  
  let approval = new Approval(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
  approval.owner = event.params.owner
  approval.spender = event.params.spender
  approval.value = event.params.value
  approval.timestamp = event.block.timestamp
  approval.block = event.block.number
  approval.token = token.id
  approval.save()
}
