import React, { useState, useEffect } from 'react';
import './Compiler.css';

const Compiler = () => {
  const [input, setInput] = useState(localStorage.getItem('input') || '');
  const [output, setOutput] = useState('');
  const [languageId, setLanguageId] = useState(localStorage.getItem('language_Id') || 2);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    localStorage.setItem('input', input);
    localStorage.setItem('language_Id', languageId);
  }, [input, languageId]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguageId(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Displaying "Creating Submission" message
      setOutput('Creating Submission ...');
  
      // Making POST request to create submission
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          method: "POST",
          headers: {
            'X-RapidAPI-Key': 'e5d18a5de9msh6ad77ce245bd0ecp14eac2jsnef482c55cf85',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            "content-type": "application/json",
            accept: "application/json",
          },
        //
        }
      );
      console.log(input,"input");
      console.log(userInput,"userinput");
      console.log(languageId,"langid")
  
      // Displaying "Submission Created" message
      setOutput(output + '\nSubmission Created ...');
  
      const jsonResponse = await response.json();
      console.log(jsonResponse,"jsonresponse")
      
      let jsonGetSolution = {
        status: { description: "Queue" },
        stderr: null,
        compile_output: null,
      };

      setOutput(`Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`);
        
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

        // Making GET request to check submission status
        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            'X-RapidAPI-Key': 'e5d18a5de9msh6ad77ce245bd0ecp14eac2jsnef482c55cf85',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            "content-type": "application/json",
          },
        });

        jsonGetSolution = await getSolution.json();
      }
      // Displaying results
      if(jsonGetSolution.status.description!=="Accepted"){
        setOutput(jsonGetSolution.status.description);
      }
      else{
        if (jsonGetSolution.stdout) {
          console.log(atob(jsonGetSolution.stdout),"******************");
          const output = atob(jsonGetSolution.stdout);
          setOutput(`Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`);
        } else if (jsonGetSolution.stderr) {
          const error = atob(jsonGetSolution.stderr);
          setOutput(`\n Error :${error}`);
        } else {
          const compilation_error = atob(jsonGetSolution.compile_output);
          setOutput(`\n Error :${compilation_error}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setOutput('Error occurred while processing the submission.');
    }
  };
  

  return (
    <>
      <div className="row container-fluid">
        <div className="col-6 ml-4 ">
          <label htmlFor="solution ">
            <span className="badge badge-info heading mt-2 ">
              <i className="fas fa-code fa-fw fa-lg"></i> Code Here
            </span>
          </label>
          <textarea
            required
            name="solution"
            id="source"
            onChange={handleInputChange}
            className="source"
            value={input}
          ></textarea>

          <button
            type="submit"
            className="btn btn-danger ml-2 mr-2 "
            onClick={handleSubmit}
          >
            <i className="fas fa-cog fa-fw"></i> Run
          </button>

          <label htmlFor="tags" className="mr-1">
            <b className="heading">Language:</b>
          </label>
          <select
            value={languageId}
            onChange={handleLanguageChange}
            id="tags"
            className="form-control form-inline mb-2 language"
          >
            <option value="54">C++</option>
            <option value="50">C</option>
            <option value="62">Java</option>
            <option value="71">Python</option>
          </select>
        </div>
        <div className="col-5">
          <div>
            <span className="badge badge-info heading my-2 ">
              <i className="fas fa-exclamation fa-fw fa-md"></i> Output
            </span>
            <textarea id="output" value={output} readOnly></textarea>
          </div>
        </div>
      </div>

      <div className="mt-2 ml-5">
        <span className="badge badge-primary heading my-2 ">
          <i className="fas fa-user fa-fw fa-md"></i> User Input
        </span>
        <br />
        <textarea id="input" onChange={handleUserInputChange}></textarea>
      </div>
    </>
  );
};

export default Compiler;
