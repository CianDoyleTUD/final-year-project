import Block from "./Block";
import { useParams } from 'react-router-dom';


  
function BlockPage(props) {
    const { tx } = useParams();
    console.log(tx)

    const sampleData = [
        {
            height: tx,
            blockhash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f', 
            timestamp: '2022-01-22 18:41',
            txcount: '1',
            difficulty: '1.00',
            version: '2022-01-22 18:41',
            bits: '486,604,799',
            size: '285' 
        }
      ];
    return (
        <div className="BlockPage">
            
            <Block blockdata={sampleData}/>
        </div>
    );
}
export default BlockPage;