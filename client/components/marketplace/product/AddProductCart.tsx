import React, { useState, useEffect } from 'react'
import { Alert, Box, Paper, Snackbar } from '@mui/material'
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import IconButton from '@mui/material/IconButton';
import { getSingleOndemandProduct, getSingleStockProduct } from '../API';
import { fetchToken } from '../token';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { addProductToCart } from '../API';
import 'animate.css'

function AddProductCart(props: any) {
  const defaultUnit = props.defaultUnit
  const productPrice = props.productPrice

  const [open, setOpen] = useState(false);
  const [alertTxt, setAlertTxt] = useState("")
  // const [addedProductPrice, setAddedProductPrice] = useState(0)

  const [unit, setUnit] = useState("")
  const [price, setPrice] = useState(0)

  const handleIncrease = (e: any) => {
    props.setAmount((prev: number) => prev + 1)
    props.setOrderDetails({...props.orderDetails, orderQuantity: props.amount+1 })
  }

  const handleDecrease = (e: any) => {
    props.setAmount((prev: number) => prev - 1)
    props.setOrderDetails({ ...props.orderDetails, orderQuantity: props.amount-1 })
  }

  const handleUnit = (val: string) => {
    setUnit(val)
    props.setOrderDetails({...props.orderDetails, orderUnit: val})
  }

  const handleAdd = async () => {
    try {
      const token = fetchToken()
      const add = await addProductToCart(props.id, token, props.orderDetails)
      let res
      if(props.stock) {
        res = await getSingleStockProduct(props.id, token, unit)
      } else {
        res = await getSingleOndemandProduct(props.id, token, unit)
      }
      // setAddedProductPrice(res.data.data.data.price)

      props.setOpen(true)
    } catch (error: any) {
      setOpen(true)
      setAlertTxt(error.response.data.message)
    }
    
  }

  const handleClose = () => {
    props.setOpen(false);
    setOpen(false)
  };

  

  const fetch = async () => {
    try {
      const token = fetchToken()
      let res
      if(props.stock) {
        res = await getSingleStockProduct(props.id, token, unit)
      } else {
        res = await getSingleOndemandProduct(props.id, token, unit)
      }
      // console.log(res)
      // props.setOrderDetails({ ...props.orderDetails, orderUnit: defaultUnit })
      setPrice(res.data.data.data.price)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit])

  const styles = {
    btn: `h-full w-20 rounded-3xl border-2 border-dark-gray text-dark-gray text-3sm font-bold focus:bg-dark-gray focus:text-white`,
    bigBtnBox: `border-1 border-light-gray w-11/12 rounded-3xl h-52 mt-5 mb-10 flex flex-col justify-around items-center`,
    blur_bigBtnBox: `border-1 border-light-gray w-11/12 rounded-3xl h-52 mt-5 mb-10 flex flex-col justify-around items-center blur-sm`,
    cartBtn: `w-11/12 h-9 rounded-3xl mb-10 mt-5 flex justify-around items-center bg-green`,
    blur_cartBtn: `w-11/12 h-9 rounded-3xl mb-10 mt-5 flex justify-around items-center bg-green blur-sm`,
    amount: `text-3sm font-semibold text-white flex justify-start items-center`,
    txt: `text-3sm font-semibold flex justify-start items-center`,
  }

  return (
    <Box className="w-full flex flex-col justify-center items-center">
      <Box className={!props.open ? styles.bigBtnBox : styles.blur_bigBtnBox}>
        <Box className='w-full flex justify-center items-center'>
          <span className='font-semibold text-2sm'>Choose amount and unit</span>
        </Box>
        <Box className="w-11/12 h-10 flex justify-center items-center">
          <IconButton className="mr-2" disabled={props.amount <= 1}  onClick={handleDecrease} >
            <RemoveOutlinedIcon />
          </IconButton>
          <Box className='border-1 rounded-3xl w-20 h-8 border-light-gray flex justify-center items-center'>
            <span 
              className='text-semibold text-3sm' 
            >
              {props.amount}
            </span>
          </Box>
          <IconButton className="ml-2" onClick={handleIncrease}>
            <AddOutlinedIcon />
          </IconButton>
        </Box>
        <Box className="w-11/12 h-8 flex justify-around items-center">
          <button className={styles.btn} value={"lb"} onClick={() => handleUnit("lb")}>
            <span className='lowercase'>lb</span>
          </button>
          <button className={styles.btn} value={"kg"} onClick={() => handleUnit("kg")}>
            <span className='lowercase'>kg</span>
          </button>
          <button className={styles.btn} value={"oz"} onClick={() => handleUnit("oz")}>
            <span className='lowercase'>oz</span>
          </button>
        </Box>
      </Box>


      <Box className={!props.open ? styles.cartBtn : styles.blur_cartBtn}>
        <span className={styles.amount}>
          $ {
              price === 0 ? 
              Number((props.amount * props.productPrice).toFixed(4)) : 
              Number((props.amount * price).toFixed(4))
            }
        </span>
        <span className={styles.txt} onClick={handleAdd}>Add to cart</span>
        <span className={styles.amount} >{unit === "" ? defaultUnit : unit}</span>
      </Box>

      {
        props.open ?

        // <Paper className='box'>
        <Paper className='animate__animated animate__bounceInDown absolute mt-32 w-11/12 border-1 rounded-3xl'>
          
          <Box className="flex flex-col justify-center items-center rounded-3xl p-5">
            <span className='text-3sm font-bold'>Added To Cart!</span>
            <Box className='mt-5 mb-1'>
              <ShoppingCartOutlinedIcon className='animate__animated animate__rubberBand animate__infinite animate__slow' />
            </Box>
            <Box className="w-6/12 h-8 rounded-3xl mt-5 flex justify-around items-center bg-green" onClick={handleClose}>
              <span className='text-2sm font-semibold'>Good!</span>
            </Box>
          </Box>
        </Paper>
        :
        <Box></Box>
      }

      <Snackbar open={open} autoHideDuration={4000} className='w-full fixed mb-10'>
        <Alert variant="filled" onClose={handleClose} severity={"warning"} className='w-11/12'>
          {alertTxt}
        </Alert>
      </Snackbar>

    </Box>
  )
}

export default AddProductCart