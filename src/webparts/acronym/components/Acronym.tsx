import * as React from 'react';
import type { IAcronymProps } from './IAcronymProps';
import styles from './Acronym.module.scss'
import { useState, useEffect } from 'react'
import { TData } from './TData'
import Button from '../../../components/Button/Button'
import AckDef from './AckDef/AckDef'
import SPListLinkParser from './SPListLinkParser';
import {
  SPHttpClient, SPHttpClientResponse
} from '@microsoft/sp-http'

export interface SPListItem {
  Acronym: string;
  Definition: string;
}
type ListTypes = 'Title' | 'Definition'

const Acronym: React.FC<IAcronymProps> = (props: IAcronymProps) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [selectedAck, setSelectedAck] = useState<string | null>(null)
  const [acksList, setAcksList] = useState<string[]>([])
  const [definition, setDefinition] = useState<string | null>(null)
  const [listData, setListData] = useState<TData[] | null>(null)
  const [letterMap, setLetterMap] = useState<Map<string, Map<string, string>>>(new Map())

  const handleClickLetter = (letter: string) => {
    if (selectedLetter !== letter) {
      setSelectedLetter(letter)
      setSelectedAck(null)
      setDefinition(null)
      return
    } else {
      setSelectedLetter(null)
      setSelectedAck(null)
      setDefinition(null)
      return
    }
  }

  const handleClickAck = (ack: string) => {
    if (selectedAck !== ack) {
      setSelectedAck(ack)
      return
    } else {
      setSelectedAck(null)
      setDefinition(null)
      return
    }
  }

  const getLetters = () => {
    if (!listData) return null
    return listData.map((listItem) => { return Object.keys(listItem)[0].charAt(0) })
  }

  const getULetters = () => {
    const letters = getLetters()
    if (!letters) return null
    return letters.reduce((uniqueLetters: string[], letter: string) => {
      if (uniqueLetters.indexOf(letter) === -1) {
        uniqueLetters.push(letter);
      }
      return uniqueLetters;
    }, [])
  }

  const initializeLetterMap = () => {
    const uLetters = getULetters()

    if (!uLetters || !listData) return null

    const tempLetterMap = letterMap
    uLetters.forEach((val) => {
      const tempMap = new Map<string, string>()

      listData.filter((item) => {
        if (Object.keys(item)[0].charAt(0) === val) {
          tempMap.set(Object.keys(item)[0], item[Object.keys(item)[0]])
        }
      })
      tempLetterMap.set(val, tempMap)
    })

    setLetterMap(tempLetterMap)
  }

  // UseEffect for the Acronym's shorthand reactivity
  useEffect(() => {
    if (selectedLetter !== null) {
      const currAckMap = letterMap.get(selectedLetter)
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
          letterMap.get(selectedLetter)?.get(selectedAck) ?? null
        )
      }
    }
  }, [selectedAck])

  // UseEffect for getting and setting the SP List Data
  useEffect(() => {
    if (!props.spListLink) return
    if (props.spListLink.length < 3) return

    const getListData = async () => {
      if (props.absoluteUrl.length < 3) {
        console.log('Base Path Invalid', props.absoluteUrl)
        return
      }

      if (props.spListLink.length < 3) {
        console.log('Sharepoint Link Length Invalid', props.spListLink)
        return
      }

      const spLink = props.spListLink
      const parsedLink = SPListLinkParser(spLink)

      if (!parsedLink) {
        console.log('Error Parsing Link', spLink, ' parsed to ', parsedLink)
        return
      }

      const basePath = new URL(props.spListLink).origin
      const subsites = props.spListLink.split('Lists')[0].split('com')[1]
      const url = basePath + subsites + `_api/web/lists/GetByTitle('${parsedLink}')/items`
      try {
        if (!props.spHttpClient) return console.error('fetch error', props.spHttpClient)
        const data = await props.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
          return response.json()
        })
        return data
      } catch (error) {
        console.error('Fetch error: ', error)
      }

    }
    const setData = async () => {
      const data = await getListData()
      const cleanData = data.value.map(
        (item: Record<ListTypes, string | number | null | boolean>) => {
          return {
            [item.Title as string]: item.Definition
          }
        })
      setListData(cleanData)
    }

    setData()
  }, [props.spListLink])

  // Lazy Coding practice, fix before prod
  useEffect(() => {
    initializeLetterMap()
  }, [listData])

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.flex} ${styles.center} ${styles.acronym_web_part}`}>
        <div className={`${styles.flex} ${styles.col} ${styles.acronym_letters} ${styles.scroll_y}`}>
          {getULetters()?.sort((a, b)=>{return a.localeCompare(b)}).map((key) => {
            return (
              <Button key={'button_letter' + '_' + key} keyofAcronym={key} selectedLetter={selectedLetter} onClick={() => { handleClickLetter(key) }}>
                {key}
              </Button>
            )
          })}
        </div>
        <div className={`${styles.flex} ${styles.col} ${styles.acronym_ack} ${styles.scroll_y}`}>
          {acksList.sort((a,b)=>{return a.localeCompare(b)}).map((ack) => {
            if (!ack) return null
            return (
              <Button key={'button_letters'+'_' + ack} keyofAcronym={ack} selectedLetter={selectedAck} onClick={()=>{ handleClickAck(ack)}}>
                {ack}
              </Button>
            )
          })}
        </div>
        <div className={`${styles.flex} ${styles.center} ${styles.col} ${styles.acronym_def}`}>
          <AckDef def={definition} />
        </div>
      </div>
    </div>
  );
}

export default Acronym

