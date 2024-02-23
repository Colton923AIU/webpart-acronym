import * as React from 'react'
import styles from './Ack.module.scss'
import Button from '../../../../components/Button/Button'

interface IAckProps {
  acks: string[],
  selectedAck: string,
  handleClickAck: (key:string)=>void
}

const Ack = ({ acks, selectedAck, handleClickAck }: IAckProps) => {
  return (
    <div className={`${styles.flex} ${styles.center} ${styles.col} ${styles.acronym_ack}`}>
      {acks.map((key) => {
        return (
          <Button keyofAcronym={key} selectedLetter={selectedAck ?? ''} onClick={() => {
            handleClickAck(key)
          }}>
            {key.toUpperCase()}
          </Button>
        )
      })
      }

    </div>
  )
}

export default Ack