function Block(props) {
    return (
        <div className="Block">
            <div className="BlockHeader">
                <h1>Block {props.height}</h1>
            </div>
            <div className="BlockInfo">
                <table className="BlockTable">
                    <tr>
                        <td>Hash</td>
                        <td>{props.blockhash}</td>
                    </tr>
                    <tr>
                        <td>Timestamp</td>
                        <td>{props.timestamp}</td>
                    </tr>
                    <tr>
                        <td>Height</td>
                        <td>{props.height}</td>
                    </tr>
                    <tr>
                        <td>Transaction count</td>
                        <td>{props.txcount}</td>
                    </tr>
                    <tr>
                        <td>Difficulty</td>
                        <td>{props.difficulty}</td>
                    </tr>
                    <tr>
                        <td>Version</td>
                        <td>{props.version}</td>
                    </tr>
                    <tr>
                        <td>Bits</td>
                        <td>{props.bits}</td>
                    </tr>
                    <tr>
                        <td>Size</td>
                        <td>{props.size}</td>
                    </tr>
                </table>
            </div>
        </div>
    );
}
export default Block;