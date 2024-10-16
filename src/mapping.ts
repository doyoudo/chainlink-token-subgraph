import { BigInt } from "@graphprotocol/graph-ts"
import {
  ChainlinkToken,
  Transfer as TransferEvent,
  Approval as ApprovalEvent
} from "../generated/ChainlinkToken/ChainlinkToken"
import { Token, Transfer, Approval } from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load("1")
  if (!token) {
    token = new Token("1")
    let contract = ChainlinkToken.bind(event.address)
    token.name = contract.name()
    token.symbol = contract.symbol()
    token.decimals = contract.decimals()
    token.totalSupply = contract.totalSupply()
  }
  token.totalSupply = token.totalSupply.plus(event.params.value)
  token.save()

  let transfer = new Transfer(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.value = event.params.value
  transfer.timestamp = event.block.timestamp
  transfer.block = event.block.number
  transfer.save()
}

export function handleApproval(event: ApprovalEvent): void {
  let approval = new Approval(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
  approval.owner = event.params.owner
  approval.spender = event.params.spender
  approval.value = event.params.value
  approval.timestamp = event.block.timestamp
  approval.block = event.block.number
  approval.save()
}
