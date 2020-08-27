import React, { useState, useEffect } from 'react'
import LazyLoad from 'react-lazyload'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Card, Button, Badge, Tag } from 'antd/es'

const Item = ({ series, setup, close, library, singleShow }) =>
 setup ? (
  <LazyLoad key={series.id} offset={6000} placeholder={<ItemCardDefault series={series} close={close} />}>
   <ItemCard series={series} library={library} singleShow={singleShow} />
  </LazyLoad>
 ) : (
  <ItemCardDefault series={series} close={close} />
 )

const ItemCard = ({ series, library, singleShow }) => {
 const [ready, setReady] = useState(false)
 const [failed, setFailed] = useState(false)
 const [exists, setExists] = useState(false)
 const [added, setAdded] = useState(false)
 const [error, setError] = useState(false)
 const [load, setLoad] = useState(false)
 const [meta, setMeta] = useState([])

 const sonarrPath = localStorage.path
 const sonarrApi = localStorage.api
 const sonarrRoot = localStorage.root
 const sonarrQuality = localStorage.quality
 const sonarrWanted = localStorage.wanted
 const sonarrFolder = localStorage.folder
 const sonarrMonitor = localStorage.monitor
 const show = series._embedded.show
 const episode = series

 /// Post to Sonarr
 const addShow = async () => {
  const res = await fetch(`${sonarrPath}/api/series/`, {
   method: 'POST',
   mode: 'cors',
   headers: { 'X-Api-Key': sonarrApi },
   body: JSON.stringify(meta)
  })
  return res
 }
 // add show on click
 const handleClick = e => {
  e.preventDefault()
  setLoad(true)
  addShow()
   .then(res => {
    setTimeout(() => {
     setAdded(true)
     setLoad(false)
    }, 800)
    console.log(res)
   })
   .catch(err => {
    setTimeout(() => {
     setError(true)
     setLoad(false)
    }, 800)
    console.log(err)
   })
 }

 const handelSingle = () => {
  singleShow(meta)
 }

 /// Sonarr Series Info
 const metaData = async series => {
  const showFetch = await fetch(
   `${sonarrPath}/api/series/lookup?term=${cln(series.name)} ${series.premiered.slice(0, 4)}&apikey=${sonarrApi}`
  )
  const showJson = await showFetch.json()
  const showData = await showJson
   .filter(
    name => name.tvdbId === series.externals.thetvdb || name.imdbId === series.externals.imdb || name.tvMazeId === series.id
   )
   .map(seriesInfo => {
    const seriesWanted = () => {
     const selected = seriesInfo.seasons.map((res, i) => {
      if (sonarrWanted === '1') {
       res.seasonNumber === 1
        ? (res.monitored = true)
        : seriesInfo.seasons.length === i + 1
        ? (res.monitored = true)
        : (res.monitored = false)
       return res
      } else if (sonarrWanted === '2') {
       res.monitored = true
       return res
      } else if (sonarrWanted === '3') {
       res.seasonNumber === 1 ? (res.monitored = true) : (res.monitored = false)
       return res
      } else if (sonarrWanted === '4') {
       seriesInfo.seasons.length === i + 1 ? (res.monitored = true) : (res.monitored = false)
       return res
      } else if (sonarrWanted === '5') {
       res.monitored = false
       return res
      }
      return res
     })
     return selected
    }

    let folderTitle = seriesInfo.title.replace(/[/\\?*:|"<>]/g, '-')

    return {
     tvdbId: seriesInfo.tvdbId.toString(),
     title: seriesInfo.title,
     qualityProfileId: sonarrQuality,
     titleSlug: seriesInfo.titleSlug,
     images: seriesInfo.images,
     poster: seriesInfo.remotePoster,
     seasons: seriesWanted(),
     path: sonarrRoot + folderTitle,
     year: seriesInfo.year,
     network: seriesInfo.network,
     seriesType: seriesInfo.seriesType,
     genres: seriesInfo.genres,
     ratings: seriesInfo.ratings,
     overview: seriesInfo.overview,
     tvMazeId: seriesInfo.tvMazeId,
     imdbId: seriesInfo.imdbId,
     season: episode.season,
     episode: episode.number,
     name: episode.name,
     airstamp: episode.airstamp,
     runtime: episode.runtime,
     type: series.type,
     summary: series.summary,
     rating: series.rating.average,
     seasonFolder: sonarrFolder,
     monitored: sonarrMonitor,
     addOptions: {
      ignoreEpisodesWithFiles: true,
      ignoreEpisodesWithoutFiles: false,
      searchForMissingEpisodes: sonarrMonitor
     }
    }
   })
  if (showData.length !== 0) {
   setMeta(...showData)
   setReady(true)
   checkExists()
  } else {
   setFailed(true)
  }
 }
 // check library for series
 const checkExists = () => {
  if (
   (library.libTvdb.includes(show.externals.thetvdb) && !added) ||
   (library.libTvmaze.includes(show.id) && !added) ||
   (library.libImdb.includes(show.externals.imdb) && !added) ||
   (library.libName.includes(show.title) && !added)
  ) {
   setExists(true)
  }
 }

 const cln = cleanTitle => cleanTitle.replace(/[^\w\s]/gi, '')
 const imgError = e => (e.target.src = show.image.medium)

 useEffect(() => {
  metaData(show)
  // eslint-disable-next-line
 }, [])

 return (
  <Link
   to={ready && `/series/${meta.titleSlug}`}
   onClick={handelSingle}
   className={`card ${classes(show.type, show.genres, show.webChannel, show.network)} ${failed ? ' failed' : ''}`}
  >
   {localStorage.recentlyAdded && localStorage.recentlyAdded.split(',').includes(show.id + '') && (
    <Badge count={'Recently Added'}></Badge>
   )}
   <Card
    hoverable
    cover={
     <>
      <img src={meta.poster} alt={meta.title} onError={imgError} />
      <img src={show.image.medium} alt={show.name} className={ready && meta.poster ? 'fade-out' : ''} />

      {series.season === 1 ? (
       <Tag className='premiere series'>Series Premiere</Tag>
      ) : (
       <Tag className='premiere'>Season {series.season}</Tag>
      )}
     </>
    }
   >
    {show.network !== null ? (
     <Card.Meta
      title={show.name}
      description={
       <span>
        <p>{network(show.network.name)}</p>
        <p>{moment(series.airstamp).format('dddd MMM Do h:mm A')}</p>
        <p>{moment(series.airstamp).format('YYYY')}</p>
       </span>
      }
      style={{ minHeight: 100 }}
     />
    ) : (
     <Card.Meta
      title={show.name}
      description={
       <span>
        <p>{network(show.webChannel.name)}</p>
        <p>{moment(series.airstamp).format('dddd MMM Do h:mm A')}</p>
        <p>{moment(series.airstamp).format('YYYY')}</p>
       </span>
      }
      style={{ minHeight: 100 }}
     />
    )}
    {!ready ? (
     <Button block disabled type='dashed' ghost className='card-button' loading>
      ADD TO LIBRARY
     </Button>
    ) : load ? (
     <Button block disabled type='dashed' ghost className='card-button' loading>
      ADD TO LIBRARY
     </Button>
    ) : exists ? (
     <Button block disabled type='dashed' ghost className='card-button'>
      IN LIBRARY
     </Button>
    ) : added ? (
     <Button block disabled ghost className='card-button' style={{ color: '#26a69a', borderColor: '#26a69a' }}>
      ADDED!
     </Button>
    ) : error ? (
     <Button block className='card-button' style={{ color: '#ff4f43', borderColor: '#ff4f43' }}>
      ERROR
     </Button>
    ) : (
     <Button block onClick={handleClick} className='card-button'>
      ADD TO LIBRARY
     </Button>
    )}
    {console.log(series)}
    {console.log(meta)}
   </Card>
  </Link>
 )
}

const ItemCardDefault = ({ series, close }) => {
 const show = series._embedded.show

 return (
  <Card
   hoverable
   cover={
    <>
     <img src={show.image.medium} alt={show.name} />
     {series.season === 1 ? (
      <Tag className='premiere series'>Series Premiere</Tag>
     ) : (
      <Tag className='premiere'>Season {series.season}</Tag>
     )}
    </>
   }
   className={'card ' + classes(show.type, show.genres, show.webChannel, show.network)}
  >
   {show.network ? (
    <Card.Meta
     title={show.name}
     description={
      <span>
       <p>{network(show.network.name)}</p>
       <p>{moment(series.airstamp).format('dddd MMM Do h:mm A')}</p>
       <p>{moment(series.airstamp).format('YYYY')}</p>
      </span>
     }
     style={{ minHeight: 100 }}
    />
   ) : (
    <Card.Meta
     title={show.name}
     description={
      <span>
       <p>{show.webChannel.name}</p>
       <p>{moment(series.airdate).format('dddd MMM Do')}</p>
       <p>{moment(series.airstamp).format('YYYY')}</p>
      </span>
     }
     style={{ minHeight: 100 }}
    />
   )}
   <Button block className='card-button' onClick={close}>
    SETUP SONARR
   </Button>
  </Card>
 )
}

const classes = (type, genre, web, network) =>
 network
  ? `${type} ${genre.join(' ')} ${network.name}`.replace('  ', ' ').toLowerCase()
  : `${type} ${genre.join(' ')} ${web.name}`.replace('  ', ' ').toLowerCase()

const network = name => {
 return name
  .replace('Network', '')
  .replace('Channel', '')
  .replace(' TV', '')
  .replace('Television', '')
  .replace('National Geographic', 'Nat Geo')
  .replace('The CW', 'CW')
  .replace('Investigation Discovery', 'ID')
  .replace('Oprah Winfrey', 'Own')
  .replace('Amazon Prime', 'Amazon')
  .replace('Facebook Watch', 'Facebook')
  .replace('America', '')
  .toUpperCase()
}

export default Item
