import { createContext, useContext, useEffect, useState } from 'react'
const CartContext = createContext(null)

export function CartProvider({ children }) {
const [cartItems, setCartItems] = useState(() => {
  try {
    const savedCart = localStorage.getItem('aura-cart')
    const parsedCart = savedCart ? JSON.parse(savedCart) : []
    return Array.isArray(parsedCart) ? parsedCart : []
  } catch {
    return []
  }
})

useEffect(() => {
  localStorage.setItem('aura-cart', JSON.stringify(cartItems))
}, [cartItems])  
function addToCart(product, selectedVariant, quantity = 1) {
const requestedQuantity = Number(quantity)

if (
  !Number.isInteger(requestedQuantity) ||
  requestedQuantity < 1 ||
  requestedQuantity > Number(selectedVariant?.stock)
) {
  return
}
    if (!selectedVariant || Number(selectedVariant.stock) <= 0) {
      return
    }

    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) =>
          item.productId === product.id &&
          item.size === selectedVariant.size
      )

      if (existingItem) {
if (
  existingItem.quantity + requestedQuantity >
  Number(selectedVariant.stock)
) { 
          return previousItems
        }

        return previousItems.map((item) =>
          item.productId === product.id &&
          item.size === selectedVariant.size
? { ...item, quantity: item.quantity + requestedQuantity }            
            : item
        )
      }

      return [
        ...previousItems,
        {
          productId: product.id,
          name: product.name,
image: `/aura-perfumes-real/images/products/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.png`,
  size: selectedVariant.size,
          price: Number(selectedVariant.price),
quantity: requestedQuantity,          
stock: Number(selectedVariant.stock),        
},
      ]
    })
  }
function removeFromCart(productId, size) {
  setCartItems((previousItems) =>
    previousItems.filter(
      (item) =>
        !(item.productId === productId && item.size === size)
    )
  )
}
function decreaseQuantity(productId, size) {
  setCartItems((previousItems) =>
    previousItems.map((item) =>
      item.productId === productId && item.size === size
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    )
  )
}

function increaseQuantity(productId, size) {
  setCartItems((previousItems) =>
    previousItems.map((item) => {
      if (item.productId === productId && item.size === size) {
        const stock = Number(item.stock)

        if (!Number.isFinite(stock) || item.quantity >= stock) {
          return item
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        }
      }

      return item
    })
  )
}
function clearCart() {
  setCartItems([])
}
return (
  <CartContext.Provider
value={{
  cartItems,
  addToCart,
  removeFromCart,
  decreaseQuantity,
increaseQuantity,
clearCart
}}  
>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
