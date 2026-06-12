import Navbar from "../components/Navbar";

function Profile() {
  return (
    <div className="page-container">
      <Navbar/>  
      <div
        className="glass"
        style={{
          maxWidth: "700px",
          margin: "auto",
          padding: "30px",
          borderRadius: "20px"
        }}
      >
        <h1>
          Profile
        </h1>

        <br />

        <p>
          Email:
          {localStorage.getItem("email")}
        </p>

        <p>
          Organization:
          Demo Company
        </p>

        <p>
          Plan:
          Free
        </p>

      </div>

    </div>
  );
}

export default Profile;