import { useCallback, useRef, useState } from "react";
import "./styles.css";

export default function App() {
  const [value, setValue] = useState("");
  const controller = useRef(null);
  const [res, setRes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    (input: string) => {
      setLoading(true);
      console.log(input);
      fetch(`https://openlibrary.org/search.json?q=${input}&page=1`, {
        signal: controller.current.signal
      })
        .then((res) => {
          res
            .json()
            .then((res2) => {
              const arr = [];
              res2.docs.forEach((item) => {
                arr.push(item.title);
              });
              setRes(arr);
              setLoading(false);
            })
            .catch((err) => {
              setLoading(false);
            });
        })
        .catch((err) => {
          setLoading(false);
        })
        .finally(() => {});
    },
    [loading]
  );

  const debounce = useCallback((fn, delay = 1000) => {
    let timerId = null;
    return (...args: any) => {
      clearTimeout(timerId);
      controller.current?.abort();
      controller.current = new AbortController();
      timerId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }, []);

  const onInput = useCallback(debounce(fetchData, 1000), []);
  return (
    <div>
      <input
        value={value}
        onInput={(e: any) => {
          setValue(e.target.value);
          onInput(e.target.value);
        }}
      />
      {loading && <>loading.....</>}
      {res.map((item) => {
        return <div>{item}</div>;
      })}
    </div>
  );
}
