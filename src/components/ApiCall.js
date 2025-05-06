import { useEffect, useState } from 'react';


function AppiCall() {
  const [data, setData] = useState('');

    useEffect(() => {
       const apiUrl = 'https://streaming.trlvdsgn.website/wp-json/wp/v2/posts';
  
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.log(error));
    },[]);
    
    return (
      <div>
       {/*console.log(data)*/}
      </div>
    );
  }
  
  export default AppiCall;