function Block({ blockdata }) {
    return (
        blockdata.map(block =>
        <div className="Block">
            <div className="BlockHeader">
                <h1>Block {block.height}</h1>
            </div>
            <div className="BlockInfo">
                <table className="BlockTable">
                   <tbody>
                        <tr>
                            <td>Hash</td>
                            <td>{block.blockhash}</td>
                        </tr>
                        <tr>
                            <td>Timestamp</td>
                            <td>{block.timestamp}</td>
                        </tr>
                        <tr>
                            <td>Height</td>
                            <td>{block.height}</td>
                        </tr>
                        <tr>
                            <td>Transaction count</td>
                            <td>{block.txcount}</td>
                        </tr>
                        <tr>
                            <td>Difficulty</td>
                            <td>{block.difficulty}</td>
                        </tr>
                        <tr>
                            <td>Version</td>
                            <td>{block.version}</td>
                        </tr>
                        <tr>
                            <td>Bits</td>
                            <td>{block.bits}</td>
                        </tr>
                        <tr>
                            <td>Size</td>
                            <td>{block.size} bytes</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        )
    );
}
export default Block;