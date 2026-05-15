import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function Projects() {

  const [projects, setProjects] =
    useState([]);

  const [form, setForm] =
    useState({

      project_name:"",

      developer:"",

      area:"",

      community:"",

      project_type:"",

      starting_price:"",

      psf:"",

      handover_date:"",

      payment_plan:"",

      roi:"",

      status:"Available",

      description:""

    });

  const fetchProjects =
    async ()=>{

      try {

        const response =
          await axios.get(
            "https://skc-cashflow.onrender.com/projects"
          );

        setProjects(response.data);

      } catch(error){

        console.log(error);

      }

    };

  useEffect(()=>{

    fetchProjects();

  },[]);

  const createProject =
    async ()=>{

      try {

        await axios.post(

          "https://skc-cashflow.onrender.com/projects",

          form

        );

        fetchProjects();

        alert("Project Added");

      } catch(error){

        console.log(error);

      }

    };

  return (

    <div>

      <h1
        style={{
          color:"white",
          marginBottom:"24px"
        }}
      >
        Off Plan Projects
      </h1>

      <div
        style={{
          background:"#0b1d1e",

          padding:"24px",

          borderRadius:"24px",

          marginBottom:"30px"
        }}
      >

        <div
          style={{
            display:"grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",

            gap:"16px"
          }}
        >

          <input
            placeholder="Project Name"
            value={form.project_name}
            onChange={(e)=>
              setForm({
                ...form,
                project_name:e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Developer"
            value={form.developer}
            onChange={(e)=>
              setForm({
                ...form,
                developer:e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Area"
            value={form.area}
            onChange={(e)=>
              setForm({
                ...form,
                area:e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Community"
            value={form.community}
            onChange={(e)=>
              setForm({
                ...form,
                community:e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Project Type"
            value={form.project_type}
            onChange={(e)=>
              setForm({
                ...form,
                project_type:e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Starting Price"
            value={form.starting_price}
            onChange={(e)=>
              setForm({
                ...form,
                starting_price:e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="PSF"
            value={form.psf}
            onChange={(e)=>
              setForm({
                ...form,
                psf:e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Handover Date"
            value={form.handover_date}
            onChange={(e)=>
              setForm({
                ...form,
                handover_date:e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Payment Plan"
            value={form.payment_plan}
            onChange={(e)=>
              setForm({
                ...form,
                payment_plan:e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="ROI"
            value={form.roi}
            onChange={(e)=>
              setForm({
                ...form,
                roi:e.target.value
              })
            }
            style={inputStyle}
          />

        </div>

        <textarea
          placeholder="Project Description"

          value={form.description}

          onChange={(e)=>
            setForm({
              ...form,
              description:e.target.value
            })
          }

          style={{

            ...inputStyle,

            marginTop:"16px",

            minHeight:"120px"

          }}
        />

        <button
          onClick={createProject}

          style={buttonStyle}
        >
          Add Project
        </button>

      </div>

      <div
        style={{
          display:"grid",
          gap:"20px"
        }}
      >

        {projects.map((item)=>(

          <div
            key={item.id}

            style={cardStyle}
          >

            <div
              style={{
                display:"flex",
                justifyContent:
                  "space-between",

                flexWrap:"wrap",

                gap:"12px"
              }}
            >

              <div>

                <h2
                  style={{
                    color:"white"
                  }}
                >
                  {item.project_name}
                </h2>

                <p style={subText}>
                  {item.developer}
                </p>

              </div>

              <div>

                <h2
                  style={{
                    color:"#facc15"
                  }}
                >
                  AED {item.starting_price}
                </h2>

                <p style={subText}>
                  {item.psf} AED PSF
                </p>

              </div>

            </div>

            <div
              style={{
                display:"grid",

                gridTemplateColumns:
                  "repeat(auto-fit,minmax(200px,1fr))",

                gap:"18px",

                marginTop:"24px"
              }}
            >

              <div>
                <p style={labelStyle}>
                  Area
                </p>

                <p style={subText}>
                  {item.area}
                </p>
              </div>

              <div>
                <p style={labelStyle}>
                  Community
                </p>

                <p style={subText}>
                  {item.community}
                </p>
              </div>

              <div>
                <p style={labelStyle}>
                  Handover
                </p>

                <p style={subText}>
                  {item.handover_date}
                </p>
              </div>

              <div>
                <p style={labelStyle}>
                  ROI
                </p>

                <p style={subText}>
                  {item.roi}
                </p>
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

const inputStyle = {

  background:"#061314",

  border:"none",

  padding:"14px",

  borderRadius:"12px",

  color:"white",

  width:"100%"

};

const buttonStyle = {

  background:"#facc15",

  color:"black",

  border:"none",

  padding:"14px 22px",

  borderRadius:"14px",

  cursor:"pointer",

  marginTop:"20px",

  fontWeight:"bold"

};

const cardStyle = {

  background:"#0b1d1e",

  padding:"24px",

  borderRadius:"24px"

};

const subText = {

  color:"#d1d5db",

  marginTop:"8px"

};

const labelStyle = {

  color:"#6b7280"

};

export default Projects;