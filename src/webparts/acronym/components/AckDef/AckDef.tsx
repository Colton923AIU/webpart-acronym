import * as React from 'react'
import styles from './AckDef.module.scss'

const AckDef = ({def} :{def: string | null}) => {
    console.log('def: ', def)
    if (!def) return null
    console.log('def!null: ', def)
    return (
        <div className={def === "" ? styles.empty : styles.wrapper}>
            {def}
        </div>
    )
}

export default AckDef