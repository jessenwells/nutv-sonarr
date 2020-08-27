import React, { useState } from 'react'
import { Modal, Steps, Form, Button, Input, Radio, Icon, Alert } from 'antd/es'

const Setup = ({ handleSubmit, handleInput, checkSonarr, testSonarr, loading, visible, close, sonarr }) => {
 const [check, setCheck] = useState({ a: false, b: false })
 const [success, setSuccess] = useState({ a: false, b: false })
 const [error, setError] = useState({ a: false, b: false })
 const [warning, setWarning] = useState({ a: false, b: false })
 const [root, setRoot] = useState('')

 const handlePath = (e) => setRoot(e.target.value)
 const [current, setCurrent] = useState(0)
 const { Step } = Steps

 const finish = () => handleSubmit().then(() => setTimeout(() => setCurrent(0), 2000))
 const prev = () => setCurrent(current - 1)
 const next = () =>
  checkApi().then(() =>
   checkSonarr().then((res) => {
    setCurrent(current + 1)
    setRoot(res)
   })
  )

 // test sonarr api
 const checkApi = async () => {
  setCheck({ a: true, b: false })
  testSonarr()
   .then((res) => {
    setTimeout(() => {
     if (res) {
      setCheck({ a: false, b: false })
      setSuccess({ a: true, b: false })
      setWarning({ a: false, b: false })
      console.log(res)
     }
    }, 600)
   })
   .catch((e) => {
    console.error(e)
    setTimeout(() => {
     setCheck({ a: false, b: false })
     setError({ a: true, b: false })
     if (sonarr.path !== null && sonarr.api !== null) {
      setWarning({ a: true, b: false })
     }
    }, 600)
   })
   .then(() => {
    setTimeout(() => {
     setError({ a: false, b: false })
     setSuccess({ a: false, b: false })
    }, 3200)
   })
 }

 // test sonarr root path
 const checkRoot = () => {
  setCheck({ a: false, b: true })
  setTimeout(() => {
   if (root === sonarr.root) {
    setCheck({ a: false, b: false })
    setSuccess({ a: false, b: true })
    setTimeout(() => {
     setSuccess({ a: false, b: false })
    }, 2400)
   } else {
    setCheck({ a: false, b: false })
    setSuccess({ a: false, b: false })
    setError({ a: false, b: true })
    setTimeout(() => {
     setRoot(sonarr.root)
     setError({ a: false, b: false })
     setSuccess({ a: false, b: true })
     setTimeout(() => {
      setSuccess({ a: false, b: false })
     }, 1800)
    }, 1400)
   }
  }, 600)
 }

 // step one - api url key
 const Step1 = ({ handleInput, sonarr, checkApi, check, success, error, warning }) => {
  return (
   <Form layout='vertical'>
    <Form.Item label='URL Path'>
     <Input
      placeholder=' example: http://localhost:8989'
      className='input-btn'
      size='large'
      name='path'
      value={sonarr.path}
      onChange={handleInput}
     />

     <Button className='input-btn' onClick={checkApi} loading={check.a}>
      {check.a ? '  ' : success.a ? <Icon type='check' /> : error.a ? <Icon type='warning' /> : 'Check'}
     </Button>
    </Form.Item>
    <Form.Item label='API Key'>
     <Input
      placeholder=' example: lbae293vh63vkm39p02j4260z46marw1'
      className='input-btn'
      size='large'
      name='api'
      value={sonarr.api}
      onChange={handleInput}
     />
     <Button className='input-btn' onClick={checkApi} loading={check.a}>
      {check.a ? '  ' : success.a ? <Icon type='check' /> : error.a ? <Icon type='warning' /> : 'Check'}
     </Button>
    </Form.Item>
    {warning.a && (
     <Alert
      message={
       <>
        make sure{' '}
        <a href={sonarr.path} style={{ textDecoration: 'underline' }}>
         Sonarr
        </a>{' '}
        is running
       </>
      }
      type='warning'
     />
    )}
   </Form>
  )
 }

 // step two - path quality
 const Step2 = ({ sonarr, handleInput, handlePath, checkRoot, check, success, error, root }) => {
  return (
   <Form layout='vertical'>
    <Form.Item label='Library Path'>
     <Input placeholder={sonarr.root} className='input-btn' value={root} onChange={handlePath} size='large' />
     <Button className='input-btn' onClick={checkRoot} loading={check.b}>
      {check.b ? '  ' : success.b ? <Icon type='check' /> : error.b ? <Icon type='warning' /> : 'Check'}
     </Button>
    </Form.Item>
    <Form.Item label='Quality Profile'>
     <Radio.Group size='large' defaultValue={sonarr.quality} name='quality' onChange={handleInput}>
      {sonarr.profiles.map((q) => (
       <Radio.Button value={q.id} key={q.id}>
        {q.name}
       </Radio.Button>
      ))}
     </Radio.Group>
    </Form.Item>
   </Form>
  )
 }

 // step three - monitor search
 const Step3 = ({ handleInput, sonarr }) => {
  return (
   <Form layout='vertical'>
    <Form.Item label='Monitored Seasons'>
     <Radio.Group defaultValue={sonarr.wanted} size='large' name='wanted' onChange={handleInput}>
      <Radio.Button value='1' style={{ width: '100%' }}>
       First and Last
      </Radio.Button>
      <Radio.Button value='2'>All</Radio.Button>
      <Radio.Button value='3'>First</Radio.Button>
      <Radio.Button value='4'>Last</Radio.Button>
      <Radio.Button value='5'>None</Radio.Button>
     </Radio.Group>
    </Form.Item>
    <Form.Item label='Series Folders'>
     <Radio.Group defaultValue={sonarr.folder} className='yesno' size='large' name='folder' onChange={handleInput}>
      <Radio.Button value={true}>Yes</Radio.Button>
      <Radio.Button value={false}>No</Radio.Button>
     </Radio.Group>
    </Form.Item>
    <Form.Item label='Search Monitored Episodes'>
     <Radio.Group defaultValue={sonarr.monitor} className='yesno' size='large' name='monitor' onChange={handleInput}>
      <Radio.Button value={true}>Yes</Radio.Button>
      <Radio.Button value={false}>No</Radio.Button>
     </Radio.Group>
    </Form.Item>
   </Form>
  )
 }

 /// Steps Component
 const steps = [
  {
   title: 'Api',
   content: (
    <Step1
     handleInput={handleInput}
     sonarr={sonarr}
     checkApi={checkApi}
     check={check}
     success={success}
     error={error}
     warning={warning}
    ></Step1>
   ),
   icon: <Icon type='frown' />
  },
  {
   title: 'Quality',
   content: (
    <Step2
     handleInput={handleInput}
     handlePath={handlePath}
     checkRoot={checkRoot}
     sonarr={sonarr}
     root={root}
     check={check}
     success={success}
     error={error}
     warning={warning}
    ></Step2>
   ),
   icon: <Icon type='meh' />
  },
  { title: 'Monitor', content: <Step3 handleInput={handleInput} sonarr={sonarr}></Step3>, icon: <Icon type='smile' /> }
 ]

 return (
  visible &&
  !loading.main && (
   <Modal
    title={
     <span>
      <b>First</b> Let's Setup Sonarr
     </span>
    }
    visible={visible}
    onCancel={close}
    style={{ top: '5rem' }}
    width={500}
    closable={false}
    footer={
     <div className='paginext'>
      {current === 0 && (
       <Button size='large' disabled>
        Previous
       </Button>
      )}
      {current > 0 && (
       <Button size='large' onClick={prev}>
        Previous
       </Button>
      )}
      {current < steps.length - 1 && (
       <Button size='large' onClick={next} className='next' loading={check.a}>
        Next
       </Button>
      )}
      {current === 2 && (
       <Button size='large' onClick={finish} className='next' loading={loading.check}>
        Finish
       </Button>
      )}
     </div>
    }
   >
    <Steps current={current}>
     {steps.map((item, i) => (
      <Step key={i} icon={item.icon} />
     ))}
    </Steps>
    <div className='steps-content'>{steps[current].content}</div>
   </Modal>
  )
 )
}

export default Setup
