import Navbar from "./components/Navbar"
export default function NotFound(){
    return(
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar/>
        {/* PAGE 404 WHEN OCCOUR */}
        <div className="ml-64 flex-1 p-8 justify-center flex items-center gap-2">
        <h1 className="text-slate-500 text-[50px] text-center">404</h1>
        <p>This is not the web page you are looking for.</p>

        </div>
    </div>
    )
}