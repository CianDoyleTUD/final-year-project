function Block({ blockdata }) {
    return (
        <div className="Block">
            <div className="BlockHeader">
                <h1>Block {blockdata.height}</h1>
            </div>
            <div className="BlockInfo">
                <table className="BlockTable">
                   <tbody>
                        <tr>
                            <td>Hash</td>
                            <td>{blockdata.blockhash}</td>
                        </tr>
                        <tr>
                            <td>Timestamp</td>
                            <td>{blockdata.timestamp}</td>
                        </tr>
                        <tr>
                            <td>Height</td>
                            <td>{blockdata.height}</td>
                        </tr>
                        <tr>
                            <td>Transaction count</td>
                            <td>{blockdata.txcount}</td>
                        </tr>
                        <tr>
                            <td>Difficulty</td>
                            <td>{blockdata.difficulty}</td>
                        </tr>
                        <tr>
                            <td>Version</td>
                            <td>{blockdata.version}</td>
                        </tr>
                        <tr>
                            <td>Bits</td>
                            <td>{blockdata.bits}</td>
                        </tr>
                        <tr>
                            <td>Size</td>
                            <td>{blockdata.size} bytes</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
};
export default Block;