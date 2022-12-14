import './App.css';
import 'macro-css';
import React from 'react'
import axios from 'axios'
import {useState, useEffect} from 'react'
import Header from './components/Header';
import Drawer from './components/Drawer'
import Home from './pages/Home'
import { Routes, Route } from "react-router-dom";
import AppContext from "./context"
import Favorites from './pages/Favorites';
import Checkout from './pages/Checkout';
import Thanksful from './pages/Thanksful';

function App() {
  const [isOpened, setIsOpened] = useState(false)
  const [items, setItems] = useState()
  const [cartItems, setCartItems] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [favorites, setFavorites] = useState()



  const onOpenedCart = ()=>{
    setIsOpened(!isOpened)
    
  }

  // const checkItemInCart = (obj)=>{
  //   if(cartItems.length===0 ){
      
  //     return false
  //   }
  //   else if(cartItems){
  //     console.log(cartItems)
  //     console.log(obj)
  //     let isExistInCart = false;
  //     cartItems.forEach(item=>{
  //       const {description, image, price} = item
  //       const object = {description, image, price}
  //       // console.log(JSON.stringify(item) === JSON.stringify(obj)) // it is not workin cause of id from asios mock api
  //       if(JSON.stringify(object) === JSON.stringify(obj)){
  //         isExistInCart = true
  //       } 
  //     })
  //     return isExistInCart;
  //   }
  // }

  const onAddToCart = async(obj)=>{
    
    try{
      const findItem=cartItems.find(item=> item.description === obj.description);
      if(findItem){
        setCartItems((prev)=>prev.filter(item=>item.description !== obj.description))
        await axios.delete(`https://62f615b0612c13062b45e6f7.mockapi.io/cart/${findItem.id}`)
        
        
      }
      else{
        const {data} = await axios.post("https://62f615b0612c13062b45e6f7.mockapi.io/cart", obj)
        setCartItems((prev)=>[...prev, obj])
        
      }
      
    }
    catch(err){

    }
      
    
    // setCartItems((prev)=>[...prev, obj]) 
  }

  const onAddToFavorites = async(obj)=>{
   
    try{
      if(favorites.find(favObj=>favObj.description === obj.description)){
        
        setFavorites((prev)=>prev.filter(item=>item.description !== obj.description))
        axios.delete(`https://62f615b0612c13062b45e6f7.mockapi.io/favorites/${obj.id}`)
      }
      else{
        const response = await axios.post("https://62f615b0612c13062b45e6f7.mockapi.io/favorites", obj)
        setFavorites((prev)=>[...prev, response.data])
        
      }
    }
    catch(error){
      alert(`Something went wrong: ${error.message}`)
    }
    
  } 

  const onDeleteItem = (id)=>{
    try{
      axios.delete(`https://62f615b0612c13062b45e6f7.mockapi.io/cart/${id}`)
      setCartItems((prev)=>prev.filter(item=>item.id!==id))
    }
    catch(error){
      console.log(error)
    }
     
    
  }

  const onDeleteFavotiteItem = (id) =>{
    console.log(id)
    axios.delete(`https://62f615b0612c13062b45e6f7.mockapi.io/favorites/${id}`)
    setFavorites((prev)=>prev.filter(item=>item.id!==id))
  }

  const isItemAdded = (description) =>{
    return cartItems.some((item)=>item.description===description)
  }

  const isItemFavorited = (description) =>{
    // console.log(id)
    console.log(favorites)
    
    // console.log(favorites[0].id)
    return favorites.some((favObj=>favObj.description===description))
  }


  useEffect(()=>{
    // fetch("https://62f615b0612c13062b45e6f7.mockapi.io/items")
    // .then((res)=>{
    //   return res.json()
    // }).
    // then((json)=>{
    //   setItems(json)
    // })
    const fetchData = async() =>{
      const ItemsResponse = await axios.get("https://62f615b0612c13062b45e6f7.mockapi.io/items")
      const CartItemsResponse = await axios.get("https://62f615b0612c13062b45e6f7.mockapi.io/cart")
      const FavoritesResponse = await axios.get("https://62f615b0612c13062b45e6f7.mockapi.io/favorites")
      setCartItems(CartItemsResponse.data)
      setItems(ItemsResponse.data)
      setFavorites(FavoritesResponse.data)
    }
    fetchData()

    // axios.get("https://62f615b0612c13062b45e6f7.mockapi.io/items").then((res)=>{
    //   setItems(res.data)
    // })
    // axios.get("https://62f615b0612c13062b45e6f7.mockapi.io/cart").then((res)=>{
    //   setCartItems(res.data)
    // })
    // axios.get("https://62f615b0612c13062b45e6f7.mockapi.io/favorites").then(res=>{
    //   setFavorites(res.data)
    // })
  },[])
  
  return (
    <AppContext.Provider value={{items,cartItems,favorites, isItemAdded, isItemFavorited, onDeleteItem, setCartItems}}>
      <div className="App" >
        {isOpened ? <Drawer cartItems = {cartItems} onOpenedCart={onOpenedCart}  onDeleteItem={onDeleteItem}/> :null}
        
        <Header onOpenedCart={onOpenedCart}/>
        <Routes>
          <Route path="/" element={<Home items={items} searchValue={searchValue} setSearchValue={setSearchValue} onAddToCart={onAddToCart} onAddToFavorites={onAddToFavorites}
          cartItems={cartItems}/>}>
            
          </Route>
          <Route path="/favorites" element={<Favorites favorites={favorites} onAddToCart={onAddToCart} onAddToFavorites={onAddToFavorites}
          onDeleteFavotiteItem={onDeleteFavotiteItem} items={items}
          />}></Route>
          <Route path="/order" element={<Checkout />}></Route>
          <Route path="/accept" element={<Thanksful />}></Route>
        </Routes>
        
      </div>
    </AppContext.Provider>
    
  );
}

export default App;
