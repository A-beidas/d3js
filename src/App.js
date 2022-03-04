import { useEffect } from "react";

function App() {

    useEffect(() => {
        // script is now fetched from the public assets folder: /scripts/main.js
        const script = document.createElement("script");
        script.innerHTML = "purchases(); corona();";
        script.async = true;
        document.body.appendChild(script);
    });
    
    return (
    <div>
        <div id="canvas-svg">
            <div>
                <h1 className='animated tada'> <pre style={{fontFamily: "Open Sans"}}> D3JS project </pre></h1>
            </div>
        </div>
        <div className="container-fluid my-6">
            <div className="row">
            <div className="col-lg-12 col-12 mb-3">
                <div className="card">
                    <div className="card-header">Corona Map</div>
                    <div className="card-body">
                        <div>
                            <svg id="corona-map" width="1200" height="800"></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12 col-12 mb-3">
                <div className="card">
                    <div className="card-header">Sales World Map</div>
                    <div className="card-body">
                            <div>
                                <svg id="bi-map" width="1200" height="800"></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}



export default App;