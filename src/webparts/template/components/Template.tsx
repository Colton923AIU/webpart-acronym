import * as React from 'react';
import type { ITemplateProps } from './ITemplateProps';
import styles from './Template.module.scss'

const Template: React.FC<ITemplateProps> = (props: ITemplateProps) => {
    return (
      <section className={styles.wrapper}>
       <span>
        But when you refresh the browser it works fine. 
       </span>
      </section>
    );
  
}

export default Template

