import * as React from 'react'
import styles from './AckDef.module.scss'

const AckDef = ({def} :{def: string | null}) => {
    if (!def) return null
    return (
        <div className={def === "" ? styles.empty : styles.wrapper}>
            {def}
        </div>
    )
}

export default AckDef