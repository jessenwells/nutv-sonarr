import React, { useState, useEffect } from 'react'
import Update from './components/Update'
import Setup from './components/Setup'
import Item from './components/Item'
import Single from './views/Single'
import store from './store'
import moment from 'moment'
import { version } from '../package.json'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { Layout, Icon, Spin, Menu, PageHeader, BackTop } from 'antd/es'

const { Header, Sider, Content } = Layout

const App = () => {
 const [schedule, setSchedule] = useState([])
 const [setup, setSetup] = useState(false)
 const [library, setLibrary] = useState([])
 const [showSetup, setShowSetup] = useState(true)
 const [loading, setLoading] = useState({
  main: false,
  test: false,
  check: false,
  error: false,
  flag: true
 })
 const [sonarr, setSonarr] = useState({
  api: '',
  path: '',
  root: '',
  quality: 6,
  profiles: [],
  folder: true,
  monitor: true,
  wanted: '1',
  library: false
 })

 const [seriesInfo, setSeriesInfo] = useState()
 const [collapsed, setCollapsed] = useState(true)
 const [showUpdate, setShowUpdate] = useState(false)

 const checkVersion = () => {
  if (localStorage.version) {
   if (localStorage.version < version) {
    setShowUpdate(true)
    localStorage.setItem('version', version)
   }
  } else {
   localStorage.setItem('version', '0')
  }
 }

 /// TVmaze Schedule and Firestore Archive
 const getSchedule = async () => {
  // archive collection
  const archiveRef = store.collection('archive')
  // archive docs
  const archive03 = await archiveRef
   .doc(prevDay(3))
   .get()
   .then(doc => doc.data())
   .catch(err => console.error(err))
  const archive04 = await archiveRef
   .doc(prevDay(4))
   .get()
   .then(doc => doc.data())
   .catch(err => console.error(err))
  const archive05 = await archiveRef
   .doc(prevDay(5))
   .get()
   .then(doc => doc.data())
   .catch(err => console.error(err))
  const archive06 = await archiveRef
   .doc(prevDay(6))
   .get()
   .then(doc => doc.data())
   .catch(err => console.error(err))
  const archive07 = await archiveRef
   .doc(prevDay(7))
   .get()
   .then(doc => doc.data())
   .catch(err => console.error(err))
  const archive08 = await archiveRef
   .doc(prevDay(8))
   .get()
   .then(doc => doc.data())
   .catch(err => console.error(err))
  const archive09 = await archiveRef
   .doc(prevDay(9))
   .get()
   .then(doc => doc.data())
   .catch(err => console.error(err))
  const archive10 = await archiveRef
   .doc(prevDay(10))
   .get()
   .then(doc => doc.data())
   .catch(err => console.error(err))
  const archive11 = await archiveRef
   .doc(prevDay(11))
   .get()
   .then(doc => doc.data())
   .catch(err => console.error(err))
  const archive12 = await archiveRef
   .doc(prevDay(12))
   .get()
   .then(doc => doc.data())
   .catch(err => console.error(err))
  const archive13 = await archiveRef
   .doc(prevDay(13))
   .get()
   .then(doc => doc.data())
   .catch(err => console.error(err))
  const archive14 = await archiveRef
   .doc(prevDay(14))
   .get()
   .then(doc => doc.data())
   .catch(err => console.error(err))
  // object to array
  const day03 = Object.keys(archive03 || {}).map(i => archive03[i])
  const day04 = Object.keys(archive04 || {}).map(i => archive04[i])
  const day05 = Object.keys(archive05 || {}).map(i => archive05[i])
  const day06 = Object.keys(archive06 || {}).map(i => archive06[i])
  const day07 = Object.keys(archive07 || {}).map(i => archive07[i])
  const day08 = Object.keys(archive08 || {}).map(i => archive08[i])
  const day09 = Object.keys(archive09 || {}).map(i => archive09[i])
  const day10 = Object.keys(archive10 || {}).map(i => archive10[i])
  const day11 = Object.keys(archive11 || {}).map(i => archive11[i])
  const day12 = Object.keys(archive12 || {}).map(i => archive12[i])
  const day13 = Object.keys(archive13 || {}).map(i => archive13[i])
  const day14 = Object.keys(archive14 || {}).map(i => archive14[i])
  // combine atchive docs
  const showArchive = [
   ...day03,
   ...day04,
   ...day05,
   ...day06,
   ...day07,
   ...day08,
   ...day09,
   ...day10,
   ...day11,
   ...day12,
   ...day13,
   ...day14
  ]
  // get full schedule
  const showSchedule = await fetch('http://api.tvmaze.com/schedule/full')
  const showScheduleJson = await showSchedule.json()
  const showScheduleData = await showScheduleJson
  // combine archive and schedule
  const all = [...showArchive, ...showScheduleData]
  // de-duplicate
  const allShows = Array.from(new Set(all.map(a => a.id))).map(id => all.find(a => a.id === id))
  // dev
  console.log(showArchive)
  console.log(allShows)
  // filter for premieres - filter web channels - sort by airdate
  const allShowData = allShows
   .filter(
    res =>
     res.number === 1 &&
     res._embedded.show.image !== null &&
     (res._embedded.show.status === 'Running' || res._embedded.show.status === 'In Development') &&
     (res._embedded.show.network !== null ||
      res._embedded.show.webChannel.id === 1 ||
      res._embedded.show.webChannel.id === 2 ||
      res._embedded.show.webChannel.id === 3 ||
      res._embedded.show.webChannel.id === 4 ||
      res._embedded.show.webChannel.id === 43 ||
      res._embedded.show.webChannel.id === 52 ||
      res._embedded.show.webChannel.id === 77 ||
      res._embedded.show.webChannel.id === 170 ||
      res._embedded.show.webChannel.id === 187 ||
      res._embedded.show.webChannel.id === 202 ||
      res._embedded.show.webChannel.id === 213 ||
      res._embedded.show.webChannel.id === 244 ||
      res._embedded.show.webChannel.id === 250 ||
      res._embedded.show.webChannel.id === 287 ||
      res._embedded.show.webChannel.id === 289 ||
      res._embedded.show.webChannel.id === 310 ||
      res._embedded.show.webChannel.id === 325 ||
      res._embedded.show.webChannel.id === 347) &&
     (res._embedded.show.network === null || res._embedded.show.network.country.code === 'US')
   )
   .sort((a, b) => (new Date(a.airstamp) > new Date(b.airstamp) ? 1 : -1))
  setSchedule(allShowData)
  setLoading({ ...loading, main: false })
  checkRecents(allShowData)
 }

 /// Check for new shows since last session
 const checkRecents = all => {
  const thisSession = all
   .filter(f => f._embedded.show.externals.imdb || f._embedded.show.externals.thetvdb)
   .map(m => m._embedded.show.id)

  let pres = thisSession
  let presArr = pres.map(i => i + '')
  let presStr = JSON.stringify(presArr)
  let past = localStorage.lastSession

  if (past) {
   let pastArr = past.split(',')
   let pastStr = JSON.stringify(pastArr)
   let newArr = presArr.filter(obj => pastArr.indexOf(obj) === -1)
   let recentArr = localStorage.recentlyAdded ? localStorage.recentlyAdded.split(',').slice(0, 15) : []
   localStorage.setItem('thisSession', pres)
   presStr !== pastStr && localStorage.setItem('recentlyAdded', [...newArr, ...recentArr])
   localStorage.setItem('lastSession', pres)
  } else {
   localStorage.setItem('lastSession', pres)
  }
 }

 /// Check Existing Library
 const checkLibrary = async (path, api) => {
  const response = await fetch(`${path}/api/series/`, {
   method: 'GET',
   mode: 'cors',
   headers: { 'X-Api-Key': api }
  })
  const json = await response.json()
  const data = await json
  const libName = await data.map(res => res.title)
  const libTvmaze = await data.map(res => res.tvMazeId)
  const libImdb = await data.map(res => res.imdbId)
  const libTvdb = await data.map(res => res.tvdbId)
  const libAll = {
   libName: libName,
   libTvmaze: libTvmaze,
   libImdb: libImdb,
   libTvdb: libTvdb
  }
  setLibrary(libAll)
 }

 // validate url
 const sonarrPath =
  sonarr.path.indexOf('://') === -1 ? 'http://' + sonarr.path.replace(/\/+$/, '') : sonarr.path.replace(/\/+$/, '')

 /// Check Sonarr API
 const checkSonarr = async () => {
  setLoading({ ...loading, check: true })

  // get root
  const responseRoot = await fetch(`${sonarrPath}/api/rootfolder/`, {
   method: 'GET',
   headers: { 'X-Api-Key': sonarr.api }
  })
  const jsonRoot = await responseRoot.json()
  const dataRoot = await jsonRoot[0].path
  // get profiles
  const responseProfile = await fetch(`${sonarrPath}/api/profile/`, {
   method: 'GET',
   headers: { 'X-Api-Key': sonarr.api }
  })
  const jsonProfile = await responseProfile.json()
  const dataProfile = await jsonProfile
  setSetup(false)
  await checkLibrary(sonarrPath, sonarr.api)
  await setSonarr({ ...sonarr, profiles: dataProfile, root: dataRoot, library: true })
  await setLoading({ ...loading, check: false })
  return dataRoot
 }

 /// Test Sonarr
 const testSonarr = async () => {
  const responseStatus = await fetch(`${sonarrPath}/api/system/status`, {
   method: 'GET',
   headers: { 'X-Api-Key': sonarr.api }
  })
  const jsonStatus = await responseStatus.json()
  const dataStatus = await jsonStatus

  return dataStatus.version
 }

 /// Setup Sonarr
 const handleSubmit = async () => {
  setLoading({ ...loading, check: true })
  localStorage.setItem('api', sonarr.api)
  localStorage.setItem('path', sonarrPath)
  localStorage.setItem('quality', sonarr.quality)
  localStorage.setItem('root', sonarr.root)
  localStorage.setItem('wanted', sonarr.wanted)
  localStorage.setItem('folder', sonarr.folder)
  localStorage.setItem('monitor', sonarr.monitor)
  //
  if (localStorage.api && localStorage.path) {
   setTimeout(() => {
    setLoading({ ...loading, check: false })
    setSetup(true)
   }, 400)
   setTimeout(() => {
    setShowSetup(false)
   }, 1600)
  }
 }
 // watch inputs
 const handleInput = e => {
  setSonarr({ ...sonarr, [e.target.name]: e.target.value })
 }

 // close setup drawer
 const closeSetup = () => setShowSetup(!showSetup)

 // single series route
 const singleShow = info => {
  console.log('ok')
  setSeriesInfo(info)
 }

 const spinner = <Icon type='loading-3-quarters' style={{ color: '#f0f0f0', fontSize: '5rem' }} spin />

 const prevDay = n =>
  moment()
   .subtract(n, 'days')
   .format('MMDDYYYY')

 useEffect(() => {
  setLoading({ ...loading, main: true })
  getSchedule()
  checkVersion()
  if (localStorage.api && localStorage.path) {
   setShowSetup(false)
   setSetup(true)
   checkLibrary(localStorage.path, localStorage.api)
  } // eslint-disable-next-line
 }, [])

 return (
  <Router>
   <div className='App'>
    {showUpdate && <Update version={version} />}
    <Setup
     handleSubmit={handleSubmit}
     handleInput={handleInput}
     checkSonarr={checkSonarr}
     testSonarr={testSonarr}
     loading={loading}
     spinner={spinner}
     visible={showSetup}
     close={closeSetup}
     sonarr={sonarr}
     setup={setup}
    />
    <Layout>
     <Sider theme='light' collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} style={{ width: '50px' }}>
      <Link to='/'>
       <div className='logo'>nutv</div>
      </Link>
      <Menu mode='inline' theme='light' style={{ height: '100%' }}>
       <Menu.Item key='1' title='archive'>
        <Link to='/'>
         <Icon type='import' />
        </Link>
       </Menu.Item>
       <Menu.Item key='2' title='picks'>
        <Link to='/'>
         <Icon type='carry-out' />
        </Link>
       </Menu.Item>
       <Menu.Item key='3' title='library'>
        <Link to='/'>
         <Icon type='profile' />
        </Link>
       </Menu.Item>
       <Menu.Item key='4' title='setup'>
        <Icon
         type='control'
         onClick={() => {
          setShowSetup(true)
         }}
        />
       </Menu.Item>
      </Menu>
     </Sider>
     <Layout>
      <Header>
       <PageHeader title='Series & Season Premiere Schedule' />
      </Header>
      <Content>
       <Switch>
        <Route
         exact
         path='/'
         render={props =>
          loading.main ? (
           <Spin indicator={spinner} className='page-center' />
          ) : (
           schedule.map((series, i) => (
            <Item key={i} series={series} setup={setup} close={closeSetup} library={library} singleShow={singleShow} />
           ))
          )
         }
        />

        <Route exact path='/series/:slug' render={props => <Single seriesInfo={seriesInfo} />} />
       </Switch>

       <BackTop className='back-top'>
        <Icon type='up-square' theme='filled' />
       </BackTop>
      </Content>
     </Layout>
    </Layout>
   </div>
  </Router>
 )
}

export default App
