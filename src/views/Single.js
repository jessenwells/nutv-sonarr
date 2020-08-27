import React, { useState } from 'react'
import placeholder from './img.jpg'
import moment from 'moment'
import { Card, Tag, Button, List } from 'antd/es'
const goBack = () => window.history.back()
const Single = ({ seriesInfo }) => {
 const pad = (n) => (n < 10 ? '0' + n.toString() : n.toString())
 const sonarrPath = localStorage.path
 const sonarrApi = localStorage.api
 const [added, setAdded] = useState(false)
 const [error, setError] = useState(false)
 const [load, setLoad] = useState(false)
 console.log(seriesInfo)

 /// Post to Sonarr
 const addShow = async () => {
  const res = await fetch(`${sonarrPath}/api/series/`, {
   method: 'POST',
   mode: 'cors',
   headers: { 'X-Api-Key': sonarrApi },
   body: JSON.stringify(seriesInfo)
  })
  return res
 }
 // add show on click
 const handleClick = (e) => {
  e.preventDefault()
  setLoad(true)
  addShow()
   .then((res) => {
    setTimeout(() => {
     setAdded(true)
     setLoad(false)
    }, 800)
    console.log(res)
   })
   .catch((err) => {
    setTimeout(() => {
     setError(true)
     setLoad(false)
    }, 800)
    console.log(err)
   })
 }

 return (
  <>
   <div className='backbttn'>
    <Button href='#' onClick={goBack} icon='caret-left'>
     Back
    </Button>
   </div>
   <Card className='single-card'>
    <div className='single-header'>
     {seriesInfo.images.length ? (
      <img
       src={
        seriesInfo.images[0].coverType === 'fanart'
         ? seriesInfo.images[0].url
         : seriesInfo.images[0].coverType === 'banner' || seriesInfo.images[0].coverType === 'poster'
         ? seriesInfo.poster
         : placeholder
       }
       alt={seriesInfo.title && seriesInfo.title}
       className={(seriesInfo.images[0].coverType === 'banner' || seriesInfo.images[0].coverType === 'poster') && 'nofan'}
      />
     ) : (
      <img src={placeholder} alt={seriesInfo.title && seriesInfo.title} />
     )}

     <h2 className='title-overlay'>{seriesInfo.title && seriesInfo.title}</h2>
    </div>
    <Card type='inner'>
     <span className='single-details'>
      {seriesInfo.airstamp && moment(seriesInfo.airstamp).format('dddd  MMMM Do  YYYY h:mm a')}
     </span>
    </Card>
    <Card type='inner' title={seriesInfo.type && <Tag>{seriesInfo.type}</Tag>} extra={seriesInfo.network}>
     <span className='overview'>{seriesInfo.overview && seriesInfo.overview}</span>
    </Card>
    <List size='small' bordered>
     <List.Item>{`S${seriesInfo.season && pad(seriesInfo.season)}E${seriesInfo.episode &&
      pad(seriesInfo.episode)} - ${seriesInfo.name && seriesInfo.name}`}</List.Item>
     <List.Item>{seriesInfo.runtime && `Length: ${seriesInfo.runtime} min`}</List.Item>
     <List.Item>{seriesInfo.genres && `Genres: ${seriesInfo.genres.map((res) => res).join(', ')}`}</List.Item>
     <List.Item>{seriesInfo.rating && `Rating: ${seriesInfo.rating}`}</List.Item>
    </List>
    <Card
     style={{ marginTop: 16 }}
     type='inner'
     title={
      !seriesInfo ? (
       <Button
        block
        disabled
        type='dashed'
        ghost
        loading
        className='card-button'
        style={{ margin: '0', borderLeft: '1px solid', borderRight: '1px solid' }}
       >
        ADD TO LIBRARY
       </Button>
      ) : load ? (
       <Button
        block
        disabled
        type='dashed'
        ghost
        loading
        className='card-button'
        style={{ margin: '0', borderLeft: '1px solid', borderRight: '1px solid' }}
       >
        ADD TO LIBRARY
       </Button>
      ) : added ? (
       <Button
        block
        disabled
        ghost
        className='card-button'
        style={{ color: '#26a69a', borderColor: '#26a69a', margin: '0', borderLeft: '1px solid', borderRight: '1px solid' }}
       >
        ADDED!
       </Button>
      ) : error ? (
       <Button
        block
        className='card-button'
        style={{ color: '#ff4f43', borderColor: '#ff4f43', margin: '0', borderLeft: '1px solid', borderRight: '1px solid' }}
       >
        ERROR
       </Button>
      ) : (
       <Button
        block
        onClick={handleClick}
        className='card-button'
        style={{ margin: '0', borderLeft: '1px solid', borderRight: '1px solid' }}
       >
        ADD TO LIBRARY
       </Button>
      )
     }
    >
     {seriesInfo.imdbId && (
      <Button href={`https://www.imdb.com/title/${seriesInfo.imdbId}`} target='_blank'>
       imdb
      </Button>
     )}
     {seriesInfo.tvdbId && (
      <Button href={`https://thetvdb.com/?tab=series&id=${seriesInfo.tvdbId}`} target='_blank'>
       tvdb
      </Button>
     )}
     {seriesInfo.tvMazeId && (
      <Button href={`https://www.tvmaze.com/shows/${seriesInfo.tvMazeId}`} target='_blank'>
       tvmaze
      </Button>
     )}
    </Card>
   </Card>
  </>
 )
}

export default Single
