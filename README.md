# Chainlink Token Subgraph

这个项目是一个用于索引Chainlink Token (LINK) 在Sepolia测试网上的事件的子图（subgraph）。

## 项目描述

本子图索引了Chainlink Token合约的Transfer和Approval事件，允许用户查询这些事件的历史数据。此外，它还维护了代币的基本信息，如名称、符号、小数位数和总供应量。

## 功能

- 索引Transfer事件
- 索引Approval事件
- 存储和更新代币基本信息

## 技术栈

- The Graph Protocol
- AssemblyScript
- GraphQL

## 快速开始

1. 克隆仓库：
   ```
   git clone https://github.com/doyoudo/chainlink-token-subgraph.git
   cd chainlink-token-subgraph   ```

2. 安装依赖：
   ```
   npm install   ```

3. 生成类型：
   ```
   graph codegen   ```

4. 构建子图：
   ```
   graph build   ```

5. 部署子图（需要先在The Graph上创建子图）：
   ```
   graph deploy --studio demo   ```

## 项目结构

- `schema.graphql`: 定义了子图的数据模型
- `subgraph.yaml`: 子图的配置文件
- `src/mapping.ts`: 包含事件处理逻辑的AssemblyScript代码
- `abis/ChainlinkToken.json`: Chainlink Token合约的ABI

## 贡献

欢迎提交问题和拉取请求。对于重大更改，请先开issue讨论您想要更改的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
