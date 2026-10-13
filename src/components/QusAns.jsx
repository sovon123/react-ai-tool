import React from 'react'
import Answers from './Answers';

const QusAns = ({item, index}) => {
  return (
    <div key={index + Math.random()} className={item.type === "q" ? 'flex justify-end mb-2' : "mb-2"}>
        {
            item.type === "q" ? 
            <li 
              key={index + Math.random()} 
              className='text-right p-1 border-8 dark:bg-zinc-700 dark:border-zinc-700 dark:text-white bg-zinc-200 border-zinc-200 text-zinc-800 rounded-tl-2xl rounded-br-2xl rounded-bl-2xl w-fit'
            >
              <Answers ans={item.text} totalResult={1} index={index} type={item.type} />
            </li> : 
            item.text.map((ansItem, ansIndex) => (
            <li key={ansIndex + Math.random()} className='text-left p-1 dark:text-zinc-300 text-zinc-800'>
                <Answers ans={ansItem} totalResult={item.length} index={ansIndex} type={item.type} />
            </li>
            ))
        }
    </div>
  )
}

export default QusAns