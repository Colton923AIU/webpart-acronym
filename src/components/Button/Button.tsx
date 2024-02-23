import * as React from 'react'
import styles from './Button.module.scss'

interface IButtonProps {
  onClick: (keyofAcronym: string) => void,
  keyofAcronym: string,
  selectedLetter?: string | null,
  children: React.ReactNode
}

const Button = ({ onClick, keyofAcronym, selectedLetter, children }: IButtonProps) => {

  if (keyofAcronym == "") return null
  return (
    <span className={selectedLetter === keyofAcronym ? `${styles.selected_letter} ${styles.min_size}` : `${styles.letter} ${styles.min_size}`} onClick={() => {
      onClick(keyofAcronym)
    }}>
      {children}
    </span>
  )
}

export default Button