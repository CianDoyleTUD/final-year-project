import { Link } from "react-router-dom";

function NavBar(props) {
    return (
        <div className="NavBar">
            <nav>
                <ul>
                    <Link to="/">
                        <li>
                            Home
                        </li>
                    </Link>
                    <Link to="/analytics">
                        <li>
                            Analytics
                        </li>
                    </Link>
                </ul>
            </nav>
        </div>
    );
}
export default NavBar;