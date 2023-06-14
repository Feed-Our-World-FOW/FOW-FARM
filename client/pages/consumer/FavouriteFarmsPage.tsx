import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Navbar from '../../components/marketplace/navBar/Navbar'
import FavouriteCardComponent from '../../components/marketplace/favourite/FavouriteCardComponent';
import { fetchToken } from '../../components/marketplace/token';
import { getMyFavouriteFarms } from '../../components/marketplace/API';

function FavouriteFarmsPage() {
  const [allFarms, setAllFarms] = useState([])

  const fetch = async () => {
    try {
      const token = fetchToken()
      const farms = await getMyFavouriteFarms(token)
      setAllFarms(farms.data.data.data.farms)
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  const styles = {
    page: `w-screen max-w-md flex flex-col justify-center items-center`,
    navBox: `w-full px-4 z-50`,
    container: `w-full flex flex-col justify-center items-center mt-24`,
  }
  
  return (
    <Box className="w-screen flex justify-center items-center">

      <Box className={styles.page}>
        <Box className={styles.navBox}>
          <Navbar 
            arrow={true} 
            myFavourite={true}
            noCart={true}
          />
        </Box>

        {/* <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
          onClick={() => setOpenBackdrop(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop> */}

        <Box className={styles.container}>

          <Box className="mt-5 w-11/12">
            {
              allFarms.map((i: any) => {
                if(!i.delivered) {
                  return (
                    <FavouriteCardComponent 
                      key={i._id} 
                      id={i?.businessAccount._id}
                      image={i?.businessAccount?.user?.photo}
                      name={i?.businessAccount?.user?.name}
                    />
                  )
                }
              })
            }
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default FavouriteFarmsPage