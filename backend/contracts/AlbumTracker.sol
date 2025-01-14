// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import './Album.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract AlbumTracker is Ownable  {
  event AlbumStateChanged(address indexed _albumAddress, uint _albumIndex, uint _stateNum, string _albumTitle);  

  enum AlbumState {
    Created, Paid, Delivered
  }

  struct AlbumProduct {
    Album album;
    AlbumState state;
    uint price;
    string title;
  }

  mapping(uint => AlbumProduct) public albums;
  uint256 public currentIndex;

 constructor() Ownable(msg.sender) {}

  function createAlbum(uint _price, string memory _title) public onlyOwner {
    Album newAlbum = new Album(_price, _title, currentIndex, this);

    albums[currentIndex].album = newAlbum;
    albums[currentIndex].state = AlbumState.Created;
    albums[currentIndex].price = _price;
    albums[currentIndex].title = _title;

    emit AlbumStateChanged(address(newAlbum),currentIndex, uint(albums[currentIndex].state), _title);

    currentIndex++;
  }

  function triggerPayment(uint _index) public payable {
    require(albums[_index].state == AlbumState.Created, "This album is already purchased!");
    require(albums[_index].price == msg.value, "We accept only full payments!");
    
    albums[_index].state = AlbumState.Paid;

    emit AlbumStateChanged(address(albums[_index].album),_index, uint(albums[_index].state), albums[_index].title);
 }

 function triggerDelivery(uint _index) public onlyOwner {
    require(albums[_index].state == AlbumState.Paid, "This album is not paid for!");
    
    albums[_index].state = AlbumState.Delivered;

    emit AlbumStateChanged(address(albums[_index].album), _index, uint(albums[_index].state), albums[_index].title);
 }
}