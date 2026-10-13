import { useEffect, useRef, useState } from 'react'
import './App.css'
import { GEMINI_URL } from './constant'
import RecentSearch from './components/RecentSearch';
import QusAns from './components/QusAns';

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(JSON.parse(localStorage.getItem("history")));
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);

  //dark mode feature
  const[darkMode, setDarkMode] = useState("dark");
  useEffect(() => {
    if(darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const askQuestion = async () => {
    if(!question && !selectedHistory) return false;
    const payloadData = question ? question : selectedHistory;
    if (!payloadData || !payloadData.trim()) {
      return; 
    }
    if(question.trim()) {
      if(localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));
        history = [question, ...history];
        localStorage.setItem("history", JSON.stringify(history));
        setRecentHistory(history);
      } else {
        localStorage.setItem("history", JSON.stringify([question]));
        setRecentHistory([question]);
      }
    }

    const payload = {
      contents: [
        {
          parts: [{ text: payloadData }]
        }
      ]
    };

    setLoader(true);

    try {
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.error) {
        console.error("API Error Message:", data.error.message);
        return;
      }
      if(data.candidates && data.candidates.length > 0) {
        let dataString = data.candidates[0].content.parts[0].text;
        dataString = dataString.split("* ");
        dataString = dataString.map((item) => item.trim());
        setResult([...result, {type: "q", text: question ? question : selectedHistory}, {type: "a", text: dataString}]);
        setQuestion("");
        setTimeout(() => {
          if (scrollToAns.current) {
            scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
          }
        }, 100);
        setLoader(false);
      } else {
        console.warn("Response received, but no candidates found.");
      }
    } catch (error) {
      console.error("Error caught during fetch:", error);
    }
  }

  const isEnterOrNot = (e) => {
    if(e.key === "Enter") {
      askQuestion();
    }
  }

  useEffect(() => {
    console.log(selectedHistory);
    askQuestion();
  }, [selectedHistory])

  return (
    <div className={darkMode === 'dark' ? 'dark' : 'light'}>
      <div className='grid grid-cols-5 h-screen text-center'>
        <select onChange={(e) => setDarkMode(e.target.value)} className='fixed dark:text-white text-zinc-800 bottom-0 p-5'>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
        <RecentSearch recentHistory={recentHistory} setRecentHistory={setRecentHistory} setSelectedHistory={setSelectedHistory} />
        <div className='col-span-4 h-screen overflow-hidden flex flex-col p-10 justify-between relative'>
          {/* Header */}
          <h1 className='text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 shrink-0'>
            Hello User, Ask me Anything
          </h1>
          
          {/* Scrollable Chat Area */}
          <div 
            ref={scrollToAns} 
            className={`flex-1 overflow-y-auto my-4 pr-6 transition-all duration-350 dark:[&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar]:w-2 ${
            loader ? 'blur-[1px] opacity-80' : ''
            }`}
          >
            <div className='dark:text-zinc-300 text-zinc-800'>
              <ul>
                {
                  result.map((item, index) => (
                    <QusAns key={index} item={item} index={index} />
                  ))
                }
              </ul>
            </div>
          </div>

          {/* Floating Loader Overlay (Positioned nicely above the input bar) */}
          {loader && (
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 dark:bg-zinc-800/90 bg-white/90 border dark:border-zinc-700 border-gray-300 px-4 py-2 rounded-full flex items-center gap-3 shadow-lg z-10 animate-fade-in">
              <svg aria-hidden="true" className="w-5 h-5 text-neutral-tertiary animate-spin fill-purple-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="text-sm dark:text-zinc-300 text-zinc-700">Thinking...</span>
            </div>
          )}

          {/* Fixed Input Bar */}
          <div className='dark:bg-zinc-800 bg-red-100 w-1/2 dark:text-white text-zinc-800 m-auto rounded-4xl border border-zinc-700 flex p-1 h-16 pr-5 items-center shrink-0'>
            <input 
              type="text" 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)} 
              onKeyDown={isEnterOrNot}
              className='w-full h-full p-3 outline-none bg-transparent' 
              placeholder='Ask me anything' 
            />
            <button 
              className='cursor-pointer' 
              onClick={askQuestion}
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App