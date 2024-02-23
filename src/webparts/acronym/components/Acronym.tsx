import * as React from 'react';
import type { IAcronymProps } from './IAcronymProps';
import styles from './Acronym.module.scss'
import { useState, useEffect } from 'react'
import { TAcks, acks } from './staticData'
import Button from '../../../components/Button/Button'
import Ack from './Ack/Ack'
import AckDef from './AckDef/AckDef'

const Acronym: React.FC<IAcronymProps> = (props: IAcronymProps) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [selectedAck, setSelectedAck] = useState<string | null>(null)
  const [acksList, setAcksList] = useState<string[]>([])
  const [definition, setDefinition] = useState<string | null>(null)

  const handleClickLetter = (letter: string) => {
    if (selectedLetter !== letter) {
      setSelectedLetter(letter)
      return
    } else {
      setSelectedLetter(null)
      return
    }
  }

  const handleClickAck = (ack: string) => {
    if (selectedAck !== ack) {
      setSelectedAck(ack)
      return
    } else {
      setSelectedAck(null)
      return
    }
  }

  const letters = acks.map((ack: TAcks) => {
    return Object.keys(ack)[0].charAt(0)
  })

  const uLetters = letters.reduce((uniqueLetters: string[], letter: string) => {
    if (uniqueLetters.indexOf(letter) === -1) {
      uniqueLetters.push(letter);
    }
    return uniqueLetters;
  }, []);

  const LetterMap = new Map<string, Map<string, string>>()
  uLetters.forEach((val) => {
    const AckSet = new Map<string, string>()

    acks.filter((ack) => {
      if (Object.keys(ack)[0].charAt(0) === val) {
        AckSet.set(Object.keys(ack)[0], ack[Object.keys(ack)[0]])
      }
    })
    LetterMap.set(val, AckSet)

  })

  // UseEffect for the Acronym's shorthand reactivity
  useEffect(() => {
    if (selectedLetter !== null) {
      const currAckMap = LetterMap.get(selectedLetter)
      if (!currAckMap) return
      const list: string[] = []
      currAckMap.forEach((val, key, map) => {
        list.push(key)
      })
      setAcksList(list)
    } else {
      setAcksList([""])
    }
  }, [selectedLetter])

  // UseEffect for the Acronym's definition reactivity
  useEffect(() => {
    if (selectedLetter !== null) {
      if (selectedAck !== null) {
        setDefinition(
          LetterMap.get(selectedLetter)?.get(selectedAck) ?? null
        )
      }
    }
  }, [selectedAck])

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.flex} ${styles.center} ${styles.acronym_web_part}`}>
        <div className={`${styles.flex} ${styles.col} ${styles.acronym_letters}`}>
          {uLetters.map((key) => {
            return (
              <Button key={'button' + '_' + key} keyofAcronym={key} selectedLetter={selectedLetter} onClick={() => { handleClickLetter(key) }}>
                {key.toUpperCase()}
              </Button>
            )
          })}
        </div>
        <Ack acks={acksList} handleClickAck={handleClickAck} selectedAck={selectedAck ?? ""} />
        <div className={`${styles.flex} ${styles.center} ${styles.col} ${styles.acronym_def}`}>
          <AckDef def={definition} />
        </div>
      </div>
    </div>
  );
}

export default Acronym

