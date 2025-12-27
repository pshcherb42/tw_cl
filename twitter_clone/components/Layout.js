export default function Layout({children}) {
    return (
        <div className="max-w-lg mx-auto border-l border-r border-twitter-border min-h-screen">
           {children} 
        </div>
    );
}