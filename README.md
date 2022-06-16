# Project description

The project is a **Bitcoin block explorer**, which is a web application that enables the user to search for real-time and historical information about the Bitcoin blockchain, including data related to blocks, transactions, addresses, and more. Block explorers make valuable blockchain data - which would otherwise only be available to a select few with programming skills and hardware capable of hosting a bitcoin node - accessible to anyone with an internet connection, while offering additional utility to casual or professional users of Bitcoin.

The application was built using **React** for the frontend, with a **Node + Express** backend and ** MongoDB database**. Automated **python** scripts are responsible for processing and maintaining the data from the blockchain, and calculating useful metrics such as the **network hash rate**, which can be used to determine mining profitability.

The transaction data is processed before it can be presented to the end user, because of how unspent transaction outputs (UTXOs) work. Auxilliary data such as the price of bitcoin is also pulled from external APIs to enhance some features of the application.

### Features:

#### Search for transactions, blocks and wallets: 
![image](https://user-images.githubusercontent.com/45643492/173963708-b5345f88-9438-4625-97cb-449a3d3b9506.png)

![image](https://user-images.githubusercontent.com/45643492/173963817-18181451-3587-43d4-9264-e195a9336345.png)

#### View transaction history of any known wallet address: 
Since the application keeps track of all transactions on the network, a record of wallet balances (which is not explicitly stored on the blockchain) can be derived from the transactional history. Historical price data is used to show what the bitcoin was worth and the time of the transaction.

A full copy of any wallets transaction history with the associated monetary value of each, can be downloaded as a spreadsheet in CSV form. This is particularly useful for individuals filing capital gains tax reports at the end of the year, and helps the user keep on top of all their (potentially taxable) transactions to date.

![image](https://user-images.githubusercontent.com/45643492/173963924-36908fd7-95d8-4210-982e-a00a7a3eff53.png)

![image](https://user-images.githubusercontent.com/45643492/173963955-642c02c0-0f47-4eb7-8d69-efa7c1344dd6.png)

#### Chart view for network metrics
Charts were created to allow the user to view the metrics gathered by the application, such as bitcoin price or hash rate, in a more interactive manner.

![image](https://user-images.githubusercontent.com/45643492/173964019-2508fcc3-d663-4148-81e7-58f0e2ce4da6.png)

#### Bitcoin mining profitability calculator 
The application uses the block data to calculate the network hash rate, which is essentially a measure of how much compute power is dedicated to mining bitcoin. This feature is of interest to **bitcoin miners **or anyone considering using their system to mine bitcoin. The hash rate can be combined with several other factors such as the **bitcoin price** and other user input, such as the** hash rate ** of their system, **cost of electricity** in their area, to determine the feasability of mining bitcoin, given their current situation.

![image](https://user-images.githubusercontent.com/45643492/173964071-0ba1f6b5-bcc1-4564-b783-27b14ffacc8a.png)

####  Wallet tracking

Users can create accounts in the application and track any number of wallets for transactional activity. They will be notified when their tracked wallets make new transactions, which makes following large whale wallets simple and inituitive.

![image](https://user-images.githubusercontent.com/45643492/173964109-5c95be85-9341-479d-9a4a-3a99484fc5ff.png)
