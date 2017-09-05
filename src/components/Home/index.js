import React, { Component } from 'react';
import './style.css';
//import Web3 from 'web3';

import _ from 'lodash'
import { Link } from 'react-router-dom'

var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));



class Home extends Component {
   constructor(props) {
      super(props);
      this.state = {
         block_ids: [],
         block_hashes: [],
         curr_block: null
      }
    }

    componentWillMount() {
       console.log(web3.eth.accounts);
       var curr_block_no = web3.eth.blockNumber;
       var curr_eth_account0 = web3.eth.accounts[0];
       var curr_eth_account1 = web3.eth.accounts[1];
       var curr_eth_balance0 = web3.eth.getBalance(curr_eth_account0); 
       var curr_eth_balance1 = web3.eth.getBalance(curr_eth_account1);       

       console.log(curr_block_no);
       console.log(curr_eth_account0);
       console.log(curr_eth_account1);
       console.log(curr_eth_balance0.toString(10));
       console.log(curr_eth_balance1.toString(10));

       web3.personal.unlockAccount(curr_eth_account0,"123456");
       web3.personal.unlockAccount(curr_eth_account1,"123456");

       this.setState({
         curr_block: curr_block_no,
         curr_account0: curr_eth_account0,
         curr_account1: curr_eth_account1,
         curr_balance0: curr_eth_balance0.toString(10),
         curr_balance1: curr_eth_balance1.toString(10)
       });
       this.getBlocks(curr_block_no);
    }

    getBlocks(curr_block_no) {
      const block_ids = this.state.block_ids.slice();
      const block_hashes = this.state.block_hashes.slice();
      var max_blocks = 10;
      if (curr_block_no < max_blocks) max_blocks = curr_block_no;
      for (var i = 0; i < max_blocks; i++, curr_block_no--) {
        var currBlockObj = web3.eth.getBlock(curr_block_no);
        block_ids.push(currBlockObj.number);
        block_hashes.push(currBlockObj.hash);
      }
      this.setState({
      block_ids: block_ids,
      block_hashes: block_hashes
      })
    }

    send() {
      web3.eth.sendTransaction({from:web3.eth.accounts[0], to:web3.eth.accounts[1],value:this.state.coin})
    }


    render() {
        console.log(web3.eth.accounts);
        var tableRows = [];
        _.each(this.state.block_ids, (value, index) => {
               tableRows.push(
                 <tr key={this.state.block_hashes[index]}>
                 <td className="tdCenter">{this.state.block_ids[index]}</td>
                 <td><Link to={`/block/${this.state.block_hashes[index]}`}>{this.state.block_hashes[index]}</Link></td>
                 </tr>
               )
        });


        return (
            <div className="Home">
                <h2>Home page</h2>
                <h2>  Current Block: {this.state.curr_block} </h2>
                <h2>  帳號0:{this.state.curr_account0} </h2>
                <h2>  帳號0餘額:{this.state.curr_balance0} </h2>
                <h2>  帳號1:{this.state.curr_account1} </h2>
                <h2>  帳號1餘額:{this.state.curr_balance1} </h2>
                <button onClick={() => this.send()}>轉帳</button>
                <input onChange={(e) => this.setState({coin: e.target.value})} />

                <table>
                  <thead><tr>
                    <th>Block No</th>
                    <th>Hash</th>
                  </tr></thead>
                  <tbody>
                    {tableRows}
                  </tbody>
               </table>
            </div>
        );
    }
}

export default Home;
