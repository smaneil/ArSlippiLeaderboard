import { getPlayerDataThrottled } from './slippi'
import * as syncFs from 'fs';
import * as path from 'path';
import util from 'util';
import * as settings from '../settings'

import { exec } from 'child_process';
const fs = syncFs.promises;
const execPromise = util.promisify(exec);

const getPlayerConnectCodes = async (): Promise<string[]> => {
	return ['NATE#303','DAN#795','SOUL#906','RIMZ#185','DRU#419','RHEN#246','FUCK#896','ROO#430','BRIT#1','DEMI#264','MKSC#118','CASA#299','RUDY#241','CREM#138','JAB#1','CNRT#306','POPE#478','FOX#283','TRIC#0','NAHR#510','TOMA#777','BIGI#200','NOIS#213','ARKS#561','VOLT#667','GARD#822','FEND#693','OHKO#209','VYN#794','YURI#443','VETH#172','RICH#951','YOSH#749','MOUZ#734','ARBY#520','COCK#818','FLOW#242','MACH#889','AAAA#763','ZEN#514','BLUE#528','HPPY#543','BEAR#676','XARQ#644','DEMI#163','CANDLE#0','ASSY#117','HOOD#899','NANI#721','GOON#410','VEGG#584','DREW#0','TOBY#172','WHIM#279','EMO#480',] };


const getPlayers = async () => {
  const codes = await getPlayerConnectCodes()
  console.log(`Found ${codes.length} player codes`)
  const allData = codes.map(code => getPlayerDataThrottled(code))
  const results = await Promise.all(allData.map(p => p.catch(e => e)));
  const validResults = results.filter(result => !(result instanceof Error));
  const unsortedPlayers = validResults
      .filter((data: any) => data.data.getUser)
      .map((data: any) => data.data.getUser);
  return unsortedPlayers.sort((p1, p2) =>
      p2.rankedNetplayProfile.ratingOrdinal - p1.rankedNetplayProfile.ratingOrdinal)
}


async function main() {
  console.log('Starting player fetch.');
  const players = await getPlayers();
  if(!players.length) {
    console.log('Error fetching player data. Terminating.')
    return
  }
  console.log('Player fetch complete.');
  // rename original to players-old
  const newFile = path.join(__dirname, 'data/players-new.json')
  const oldFile = path.join(__dirname, 'data/players-old.json')
  const timestamp = path.join(__dirname, 'data/timestamp.json')

  await fs.rename(newFile, oldFile)
  console.log('Renamed existing data file.');
  await fs.writeFile(newFile, JSON.stringify(players));
  await fs.writeFile(timestamp, JSON.stringify({updated: Date.now()}));
  console.log('Wrote new data file and timestamp.');
  // const rootDir = path.normalize(path.join(__dirname, '..'))
  // console.log(rootDir)
  // // if no current git changes
  // const { stdout, stderr } = await execPromise(`git -C ${rootDir} status --porcelain`);
  // if(stdout || stderr) {
  //   console.log('Pending git changes... aborting deploy');
  //   return
  // }
  // console.log('Deploying.');
  // const { stdout: stdout2, stderr: stderr2 } = await execPromise(`npm run --prefix ${rootDir} deploy`);
  // console.log(stdout2);
  // if(stderr2) {
  //   console.error(stderr2);
  // }
  // console.log('Deploy complete.');
}

main();
