'use client';
import clsx from 'clsx';
import React, { useState, useEffect, Suspense } from 'react';

const Nav = ({ data }) => {
  return (
    <ol
      role="list"
      className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0 "
    >
      {Array(10)
        .fill('')
        .map((_, index) => {
          return (
            <li className="relative md:flex " key={index}>
              <div
                href="#"
                className="flex items-center px-6 py-4 text-sm font-medium"
                aria-current="step"
              >
                <span
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300"
                  style={{
                    backgroundColor: index < data ? 'darkgray' : 'bg-gray-400',
                    borderColor: index == data ? 'darkgray' : 'bg-gray-400'
                  }}
                >
                  <span className="text-gray-600">{index + 1}</span>
                </span>
              </div>
              <div
                className="absolute right-0 top-0 hidden h-full w-5 md:block"
                aria-hidden="true"
              >
                <svg
                  className="h-full w-full text-gray-300"
                  viewBox="0 0 22 80"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 -2L20 40L0 82"
                    vectorEffect="non-scaling-stroke"
                    stroke="currentcolor"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </li>
          );
        })}
    </ol>
  );
};

export default function Home() {
  const [data, setData] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [counter, setCounter] = useState(30);
  const [selected, setSelected] = useState(4); //0:a | 1:b | 2:c | 3:d | 4:boş
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(datas => {
        const filter = datas?.filter(item => item.userId === 1);
        setData(filter);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  const [activeQuestion, setActiveQuestion] = useState({});

  useEffect(() => {
    setActiveQuestion({
      title: data[questionIndex]?.title,
      answers: data[questionIndex]?.body.split('\n')
    });
  }, [data, questionIndex]);

  const onClick = index => {
    setSelected(index);
  };
  useEffect(() => {
    const timer = setInterval(() => {
      if (questionIndex === data.length ) {
        clearInterval(timer);
      }
      setCounter(prevCount => prevCount - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [questionIndex,data]);

  useEffect(() => {
    if (counter <= 0) {
      setCompleted([...completed, selected]);
      setSelected(4);
      setQuestionIndex(prev => prev + 1);
      setCounter(30);
    }
  }, [counter]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4">
      <Nav data={questionIndex} />
      {questionIndex !== data.length && (
        <>
          <div className="container w-1/2 mx-auto bg-gray-200 rounded-2xl shadow p-5 gap-2 relative mt-10">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Question
            </h1>
            <div className="text-sm text-gray-500 text-center ">
              {activeQuestion.title}
            </div>
            <div className="absolute top-0 right-0 -translate-y-full p-2">
              Kalan Süre: {counter}sn
            </div>
          </div>
          <div className="container w-1/2 mx-auto  p-x-5 grid gap-2">
            <h1 className="text-2xl font-bold text-gray-800 ">Answers</h1>
            {activeQuestion.answers?.map((item, index) => {
              return (
                <button
                  onClick={() => onClick(index)}
                  key={index}
                  className={clsx(
                    'text-sm flex items-center text-left text-gray-500 px-6 py-3 bg-gray-100 rounded-md border-2 border-gray-300 hover:border-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed disabled:hover:border-gray-300',
                    selected == index && 'border-pink-500 hover:border-pink-500'
                  )}
                  disabled={counter < 20 ? false : true}
                >
                  <div className="min-w-10 mr-4 -ml-1 flex justify-center items-center min-h-10 border-2 rounded-xl">
                    {index == 0
                      ? 'A'
                      : index == 1
                      ? 'B'
                      : index == 2
                      ? 'C'
                      : 'D'}
                  </div>
                  {item}
                </button>
              );
            })}
          </div>
        </>
      )}
      {questionIndex == data.length && (
        <div className="container w-1/2 mx-auto  p-x-5">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Answers</h1>
          {data.map((item, index) => {
            return (
              <div
                key={index}
                className="text-sm flex justify-between items-center text-gray-500 px-6 py-3 bg-gray-100 rounded border border-gray-300 hover:border-gray-400"
              >
                <div className="text-md font-bold text-gray-800 flex:1">
                  {item?.title}
                </div>
                <div className="min-w-12 min-h-12 bg-gray-200 shadow-md justify-center items-center flex mr-4">
                  {completed[index] == 0
                    ? 'A'
                    : completed[index] == 1
                    ? 'B'
                    : completed[index] == 2
                    ? 'C'
                    : completed[index] == 3
                    ? 'D'
                    : completed[index] == 4
                    ? 'Boş'
                    : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
