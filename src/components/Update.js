import React, { useState } from 'react'
import { Modal, List, Icon } from 'antd/es'

const Update = ({ version }) => {
 const [show, setShow] = useState(true)
 const data = [
  {
   icon: 'tool',
   title: 'RE-FIX: ',
   sub: 'SERIES FOLDER NAME',
   desc: 'Corrected folder name when adding a series to Sonarr. Replacing certain illegal characters',
   desc2: 'Caused ERROR when adding series'
  }
 ]

 return (
  <Modal
   title={
    <span>
     Change <b>Log</b>
    </span>
   }
   visible={show}
   style={{ top: '5rem' }}
   width={500}
   closable={true}
   onCancel={() => setShow(!show)}
   footer={<p style={{ textAlign: 'center', marginBottom: '0' }}>{version}</p>}
   className='updates'
  >
   <List
    itemLayout='horizontal'
    dataSource={data}
    renderItem={item => (
     <List.Item>
      <List.Item.Meta
       title={
        <span>
         <Icon type={item.icon} style={{ width: '32px', fontSize: '1.1em', verticalAlign: '-0.2em' }} />
         <b>{item.title}</b>
         {item.sub}
        </span>
       }
       description={
        <p style={{ marginLeft: '32px', marginBottom: '0' }}>
         {item.desc}
         <br />
         {item.desc2}
        </p>
       }
      />
     </List.Item>
    )}
   />
  </Modal>
 )
}

export default Update
