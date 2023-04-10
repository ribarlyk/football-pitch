import "./Pitch.scss"
import { useEffect, useState } from "react"
import Animations from "../SkeletonPlayers"
import uniqid from "uniqid"
import ShirtButton from "../ShirtButton"
import PaginationOutline from "../Pagination/Pagination"
import BasicModal from "../Modal/Modal"
import PopUpSuccess from "./PopupSuccess"

export default function Pitch() {
    const [players, setPlayers] = useState('');
    const [loading, setLoading] = useState(false);
    const [goalkeeper, setGoalkeeper] = useState([]);
    const [defender, setDefender] = useState([]);
    const [midfielder, setMidfielder] = useState([]);
    const [attacker, setAttacker] = useState([]);
    const [page, setPage] = useState(1);
    const [budget, setBudget] = useState(JSON.parse(localStorage.getItem('budget')) || 450);
    const [substitute, setSubstitute] = useState([]);
    const [myTeam, setMyTeam] = useState('');
    const [isTeamChoosen, setIsTeamChoosen] = useState(!!JSON.parse(localStorage.getItem('team')));
    const [localStorageTeam, setLocalStorageTeam] = useState('');
    const [nameClass, setNameClass] = useState(false)
    const [playerIn, setPlayerIn] = useState(null)
    const [isChange, setIsChange] = useState(false)
    const [isTeamSaved, setIsTeamSaved] = useState(!!JSON.parse(localStorage.getItem('team')) || false)

    useEffect(() => {
        const team = JSON.parse(localStorage.getItem('team'))

        setLocalStorageTeam(team)


    }, [isChange])

    useEffect(() => {

        fetch(`https://api-football-v1.p.rapidapi.com/v3/players?league=39&season=2022&page=${page}`, {
            headers: {
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
                'X-RapidAPI-Key': "api key here",
            }
        }).then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error('error in db')
            }
        }
        ).then(data => {
            setLoading(!loading);
            setPlayers(data);
        }).catch(err => {
            setLoading(!loading)
        })
    }, [page]) // да се изкара в папкa service и да се ползва axios



    const createPlayerSection = (containerClass, heading, role) => {
        return (
            <>
                < div className="header-data"> {heading}</div>
                < table className={containerClass} >
                    <tbody>
                        {
                            !loading
                                ? <tr><td><Animations /></td></tr>

                                : players.response
                                    .filter(x => x.statistics[0].games.position === role
                                    )
                                    .map(x => {
                                        return <tr key={uniqid()} onClick={() => { onPlayerClickHandler(x) }}>
                                            <td><img width="30" height="30" src={x.statistics[0].team.logo}></img></td>
                                            <td>{x.player.firstname} {x.player.lastname}</td>
                                            <td>{x.player.age || 10} $</td>
                                        </tr>
                                    })
                        }
                    </tbody>


                </table >
            </>)

    }

    const onPlayerClickHandler = (player) => {
        let sumToBuy = player.player.age || 10;
        let position = player.statistics[0].games.position

        if (position === 'Goalkeeper') {
            if (goalkeeper.length < 1) {
                player.jersey = "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp"
                setGoalkeeper((prev) => [...prev, player])
            }
        } else if (position === 'Defender') {
            if (defender.length < 4 && !defender.includes(player.player.name)) {
                setDefender((prev) => [...prev, player])
                player.jersey = "assets/juventus.png=z-0,0_f-webp"

            }
        } else if (position === 'Midfielder') {
            if (midfielder.length < 4) {
                setMidfielder((prev) => [...prev, player])
                player.jersey = "assets/arsenal;.png=z-0,0_f-webp"

            }
        } else if (position === 'Attacker') {
            if (attacker.length < 2) {
                setAttacker((prev) => [...prev, player])
                player.jersey = "assets/brasilyellow.png=z-0,0_f-webp"

            }

        }

        if (goalkeeper.length >= 1 && defender.length >= 4 && midfielder.length >= 4 && attacker.length >= 2) {
            setSubstitute((prev) => [...prev, player])
            player.jersey = "assets/levski.webp"
        }

        if (substitute.length === 4) {
            setIsTeamChoosen(!isTeamChoosen)
        }

        if (budget - sumToBuy < 0) {
            alert('not enought money')
        }

        setBudget((prev => Number(prev) - Number(sumToBuy)))
        localStorage.setItem('budget', JSON.stringify(budget))



    }

    const saveTeamHandler = () => {
        setMyTeam([...goalkeeper, ...defender, ...midfielder, ...attacker, ...substitute]);
        setLocalStorageTeam(JSON.parse(localStorage.getItem('team'))
            || [...goalkeeper, ...defender, ...midfielder, ...attacker, ...substitute])
        setIsTeamSaved(!isTeamSaved)
    }

    if (myTeam.length > 0) {
        let team = JSON.parse(localStorage.getItem('team'))
            || [...goalkeeper, ...defender, ...midfielder, ...attacker, ...substitute];

        localStorage.setItem('team', JSON.stringify(team))
    }

    const onPlayerChangeHandler = (bool, playerRotate) => {
        setNameClass(bool)
        setPlayerIn(playerRotate)
        setIsChange(!isChange)
        return playerIn
    }

    const rowGenerator = (pos, styleClass, localIndex, stateIndex) => {
        return (
            <div className={styleClass}>
                {isTeamSaved
                    ? <BasicModal name={localStorageTeam[localIndex]?.player?.name ? localStorageTeam[localIndex]?.player?.name : pos[stateIndex]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                    : null}
                {localStorageTeam
                    ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[localIndex]?.statistics[0].games.position} name={localStorageTeam[localIndex]?.player?.name} jersey={localStorageTeam[localIndex] ? localStorageTeam[localIndex].jersey : "assets/no-player.png=z-0,0_f-webp"} />
                    : <ShirtButton position={pos[stateIndex]?.statistics[0].games.position} name={pos[stateIndex]?.player?.name} jersey={pos[stateIndex] ? pos[stateIndex].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

            </div>
        )
    }

    return (
        <>
            <div className="budget-container">
                <h2>{budget} Mil</h2>
            </div>
            <div className="container">
                <div className="pitch-container">
                    <div className="pitch-background" >

                        <div className={!nameClass ? "row-one" : "row-one-change"}>
                            {rowGenerator(goalkeeper, "goalkeeper", 0, 0)}
                        </div>

                        <div className={!nameClass ? "row-two" : "row-two-change"}>
                            {rowGenerator(defender, "defender", 1, 0)}
                            {rowGenerator(defender, "defender", 3, 1)}
                            {rowGenerator(defender, "defender", 4, 2)}
                            {rowGenerator(defender, "defender", 5, 3)}
                        </div>

                        <div className={!nameClass ? "row-three" : "row-three-change"}>
                            {rowGenerator(midfielder, "midfielder", 5, 0)}
                            {rowGenerator(midfielder, "midfielder", 6, 1)}
                            {rowGenerator(midfielder, "midfielder", 7, 2)}
                            {rowGenerator(midfielder, "midfielder", 8, 3)}
                        </div>

                        <div className={!nameClass ? "row-four" : "row-four-change"}>
                            {rowGenerator(attacker, "striker", 9, 0)}
                            {rowGenerator(attacker, "striker", 10, 1)}
                        </div>

                        <div className="row-five" >
                            <div className={nameClass ? "substitute-one" : null}>{rowGenerator(substitute, null, 11, 0)}</div>
                            <div className={nameClass ? "substitute-two" : null}>{rowGenerator(substitute, null, 12, 1)}</div>
                            <div className={nameClass ? "substitute-three" : null}>{rowGenerator(substitute, null, 13, 2)}</div>
                            <div className={nameClass ? "substitute-four" : null}>{rowGenerator(substitute, null, 14, 3)}</div>
                            <div className={nameClass ? "substitute-five" : null}>{rowGenerator(substitute, null, 15, 4)}</div>
                        </div>
                    </div>
                    {/* {true ? <PopUpSuccess /> : null} TODO massege for saving team*/}
                    {isTeamChoosen
                        ? <button onClick={() => { saveTeamHandler() }} className="save-team-button" disabled={isTeamSaved} >Save Team</button>
                        : null}
                    {/* {isTeamChoosen
                        ? <button className="set-captain" >Set Captain</button>
                        : null} TODO SET CAPTAIN OPTIONAL*/}

                </div >
                <div className="players-container">
                    {createPlayerSection("goalkeepers", 'GOALKEEPERS', "Goalkeeper")}
                    {createPlayerSection("defenders", 'DEFENDERS', "Defender")}
                    {createPlayerSection("midfielders", 'MIDFIELDERS', "Midfielder")}
                    {createPlayerSection("attackers", 'ATTACKERS', "Attacker")}
                    <PaginationOutline setPage={setPage} page={page} setLoading={setLoading} loading={loading} />
                </div>
            </div >

        </>

    )
}

// <div className={nameClass ? "substitute-two" : null}>
// {isTeamSaved
//     ? <BasicModal name={localStorageTeam[12]?.player?.name ? localStorageTeam[12]?.player?.name : substitute[1]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
//     : null}
// {localStorageTeam
//     ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[12]?.statistics[0].games.position} name={localStorageTeam[12]?.player?.name} jersey={localStorageTeam[12] ? localStorageTeam[12].jersey : "assets/no-player.png=z-0,0_f-webp"} />
//     : <ShirtButton position={substitute[1]?.statistics[0].games.position} name={substitute[1]?.player?.name} jersey={substitute[1] ? substitute[1].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

// </div>
// <div className={nameClass ? "substitute-three" : null}>
// {isTeamSaved
//     ? <BasicModal name={localStorageTeam[13]?.player?.name ? localStorageTeam[13]?.player?.name : substitute[2]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
//     : null}
// {localStorageTeam
//     ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[13]?.statistics[0].games.position} name={localStorageTeam[13]?.player?.name} jersey={localStorageTeam[13] ? localStorageTeam[13].jersey : "assets/no-player.png=z-0,0_f-webp"} />
//     : <ShirtButton position={substitute[2]?.statistics[0].games.position} name={substitute[2]?.player?.name} jersey={substitute[2] ? substitute[2].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

// </div>
// <div className={nameClass ? "substitute-four" : null}>
// {isTeamSaved
//     ? <BasicModal name={localStorageTeam[14]?.player?.name ? localStorageTeam[14]?.player?.name : substitute[3]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
//     : null}
// {localStorageTeam
//     ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[14]?.statistics[0].games.position} name={localStorageTeam[14]?.player?.name} jersey={localStorageTeam[14] ? localStorageTeam[14].jersey : "assets/no-player.png=z-0,0_f-webp"} />
//     : <ShirtButton position={substitute[3]?.statistics[0].games.position} name={substitute[3]?.player?.name} jersey={substitute[3] ? substitute[3].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

// </div>
// <div className={nameClass ? "substitute-five" : null}>
// {isTeamSaved
//     ? <BasicModal name={localStorageTeam[15]?.player?.name ? localStorageTeam[15]?.player?.name : substitute[4]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
//     : null}

// {localStorageTeam
//     ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[15]?.statistics[0].games.position} name={localStorageTeam[15]?.player?.name} jersey={localStorageTeam[15] ? localStorageTeam[15].jersey : "assets/no-player.png=z-0,0_f-webp"} />
//     : <ShirtButton position={substitute[4]?.statistics[0].games.position} name={substitute[4]?.player?.name} jersey={substitute[4] ? substitute[4].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

// </div>

// const midfieldersView = () => {
//     const midfielders = [
//         { position: 5, name: localStorageTeam[5]?.player?.name || midfielder[0]?.player?.name, jersey: localStorageTeam[5]?.jersey || midfielder[0]?.jersey, games: localStorageTeam[5]?.statistics[0]?.games || midfielder[0]?.statistics[0]?.games },
//         { position: 6, name: localStorageTeam[6]?.player?.name || midfielder[1]?.player?.name, jersey: localStorageTeam[6]?.jersey || midfielder[1]?.jersey, games: localStorageTeam[6]?.statistics[0]?.games || midfielder[1]?.statistics[0]?.games },
//         { position: 7, name: localStorageTeam[7]?.player?.name || midfielder[2]?.player?.name, jersey: localStorageTeam[7]?.jersey || midfielder[2]?.jersey, games: localStorageTeam[7]?.statistics[0]?.games || midfielder[2]?.statistics[0]?.games },
//         { position: 8, name: localStorageTeam[8]?.player?.name || midfielder[3]?.player?.name, jersey: localStorageTeam[8]?.jersey || midfielder[3]?.jersey, games: localStorageTeam[8]?.statistics[0]?.games || midfielder[3]?.statistics[0]?.games }
//     ];

//     return (
//         <div>
//             {midfielders.map(midfielder => (
//                 <div className="midfielder" key={midfielder.position}>
//                     {isTeamSaved && (
//                         <BasicModal
//                             name={midfielder.name}
//                             onPlayerChangeHandler={onPlayerChangeHandler}
//                         />
//                     )}
//                     {localStorageTeam ? (
//                         <ShirtButton
//                             isChange={isChange}
//                             setIsChange={setIsChange}
//                             onPlayerChangeHandler={onPlayerChangeHandler}
//                             localStorageTeam={localStorageTeam}
//                             position={midfielder.games.position}
//                             name={midfielder.name}
//                             jersey={midfielder.jersey}
//                         />
//                     ) : (
//                         <ShirtButton
//                             position={midfielder.games.position}
//                             name={midfielder.name}
//                             jersey={midfielder.jersey}
//                         />
//                     )}
//                 </div>
//             ))}
//         </div>
//     );
// }



{/* <div className="defender">
                                {isTeamSaved
                                    ? <BasicModal name={localStorageTeam[1]?.player?.name ? localStorageTeam[1]?.player?.name : defender[0]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[1]?.statistics[0].games.position} name={localStorageTeam[1]?.player?.name} jersey={localStorageTeam[1] ? localStorageTeam[1].jersey : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={defender[0]?.statistics[0].games.position} name={defender[0]?.player?.name} jersey={defender[0] ? defender[0].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div> */}
{/* <div className="defender">
                                {isTeamSaved
                                    ? <BasicModal name={localStorageTeam[2]?.player?.name ? localStorageTeam[2]?.player?.name : defender[1]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[2]?.statistics[0].games.position} name={localStorageTeam[2]?.player?.name} jersey={localStorageTeam[2] ? localStorageTeam[2].jersey : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={defender[1]?.statistics[0].games.position} name={defender[1]?.player?.name} jersey={defender[1] ? defender[1].jersey : "assets/no-player.png=z-0,0_f-webp"} />}


                            </div>
                            <div className="defender">
                                {isTeamSaved
                                    ? <BasicModal name={localStorageTeam[3]?.player?.name ? localStorageTeam[3]?.player?.name : defender[2]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[3]?.statistics[0].games.position} name={localStorageTeam[3]?.player?.name} jersey={localStorageTeam[3] ? localStorageTeam[3].jersey : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={defender[2]?.statistics[0].games.position} name={defender[2]?.player?.name} jersey={defender[2] ? defender[2].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                            <div className="defender">
                                {isTeamSaved
                                    ? <BasicModal name={localStorageTeam[4]?.player?.name ? localStorageTeam[4]?.player?.name : defender[3]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[4]?.statistics[0].games.position} name={localStorageTeam[4]?.player?.name} jersey={localStorageTeam[4] ? localStorageTeam[4].jersey : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={defender[3]?.statistics[0].games.position} name={defender[3]?.player?.name} jersey={defender[3] ? defender[3].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div> */}

//     <div className="midfielder">
//     {isTeamSaved
//         ? <BasicModal name={localStorageTeam[6]?.player?.name ? localStorageTeam[6]?.player?.name : midfielder[1]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
//         : null}
//     {localStorageTeam
//         ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[6]?.statistics[0].games.position} name={localStorageTeam[6]?.player?.name} jersey={localStorageTeam[6] ? localStorageTeam[6].jersey : "assets/no-player.png=z-0,0_f-webp"} />
//         : <ShirtButton position={midfielder[1]?.statistics[0].games.position} name={midfielder[1]?.player?.name} jersey={midfielder[1] ? midfielder[1].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

// </div>
// <div className="midfielder">
//     {isTeamSaved
//         ? <BasicModal name={localStorageTeam[7]?.player?.name ? localStorageTeam[7]?.player?.name : midfielder[2]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
//         : null}
//     {localStorageTeam
//         ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[7]?.statistics[0].games.position} name={localStorageTeam[7]?.player?.name} jersey={localStorageTeam[7] ? localStorageTeam[7].jersey : "assets/no-player.png=z-0,0_f-webp"} />
//         : <ShirtButton position={midfielder[2]?.statistics[0].games.position} name={midfielder[2]?.player?.name} jersey={midfielder[2] ? midfielder[2].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

// </div>
// <div className="midfielder">
//     {isTeamSaved
//         ? <BasicModal name={localStorageTeam[8]?.player?.name ? localStorageTeam[8]?.player?.name : midfielder[3]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
//         : null}
//     {localStorageTeam
//         ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[8]?.statistics[0].games.position} name={localStorageTeam[8]?.player?.name} jersey={localStorageTeam[8] ? localStorageTeam[8].jersey : "assets/no-player.png=z-0,0_f-webp"} />
//         : <ShirtButton position={midfielder[3]?.statistics[0].games.position} name={midfielder[3]?.player?.name} jersey={midfielder[3] ? midfielder[3].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

// </div>

//     <div className="striker">
//     {isTeamSaved
//         ? <BasicModal name={localStorageTeam[10]?.player?.name ? localStorageTeam[10]?.player?.name : attacker[1]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
//         : null}
//     {localStorageTeam
//         ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[10]?.statistics[0].games.position} name={localStorageTeam[10]?.player?.name} jersey={localStorageTeam[10] ? localStorageTeam[10].jersey : "assets/no-player.png=z-0,0_f-webp"} />
//         : <ShirtButton position={attacker[1]?.statistics[0].games.position} name={attacker[1]?.player?.name} jersey={attacker[1] ? attacker[1].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

// </div>



const goalkeeperRowView = (localIndex) => {
    return (<>
        {isTeamSaved
            ? <BasicModal name={localStorageTeam[localIndex]?.player?.name ? localStorageTeam[localIndex]?.player?.name : goalkeeper[localIndex]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
            : null}
        {localStorageTeam
            ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[localIndex]?.statistics[0].games.position} name={localStorageTeam[localIndex]?.player?.name} jersey={localStorageTeam[localIndex] ? localStorageTeam[localIndex].jersey : "assets/no-player.png=z-0,0_f-webp"} />
            : <ShirtButton position={goalkeeper[localIndex]?.statistics[0].games.position} name={goalkeeper[localIndex]?.player?.name} jersey={goalkeeper[localIndex] ? goalkeeper[localIndex].jersey : "assets/no-player.png=z-0,0_f-webp"} />}
    </>)

}
const defenderRowView = (localIndex, stateIndex) => {
    return (<div className="defender">
        {isTeamSaved
            ? <BasicModal name={localStorageTeam[localIndex]?.player?.name ? localStorageTeam[localIndex]?.player?.name : defender[stateIndex]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
            : null}
        {localStorageTeam
            ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[localIndex]?.statistics[0].games.position} name={localStorageTeam[localIndex]?.player?.name} jersey={localStorageTeam[localIndex] ? localStorageTeam[localIndex].jersey : "assets/no-player.png=z-0,0_f-webp"} />
            : <ShirtButton position={defender[stateIndex]?.statistics[0].games.position} name={defender[stateIndex]?.player?.name} jersey={defender[stateIndex] ? defender[stateIndex].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

    </div>)
}
const midfielderRowView = (localIndex, stateIndex) => {
    return (
        <div className="midfielder">
            {isTeamSaved
                ? <BasicModal name={localStorageTeam[localIndex]?.player?.name ? localStorageTeam[localIndex]?.player?.name : midfielder[stateIndex]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} /> : null}
            {localStorageTeam
                ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[localIndex]?.statistics[0].games.position} name={localStorageTeam[localIndex]?.player?.name} jersey={localStorageTeam[localIndex] ? localStorageTeam[localIndex].jersey : "assets/no-player.png=z-0,0_f-webp"} />
                : <ShirtButton position={midfielder[stateIndex]?.statistics[0].games.position} name={midfielder[stateIndex]?.player?.name} jersey={midfielder[stateIndex] ? midfielder[stateIndex].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

        </div>
    )
}
const attackerRowView = (localIndex, stateIndex) => {

    return (
        <div className="striker">
            {isTeamSaved
                ? <BasicModal name={localStorageTeam[localIndex]?.player?.name ? localStorageTeam[localIndex]?.player?.name : attacker[stateIndex]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                : null}
            {localStorageTeam
                ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[localIndex]?.statistics[0].games.position} name={localStorageTeam[localIndex]?.player?.name} jersey={localStorageTeam[localIndex] ? localStorageTeam[localIndex].jersey : "assets/no-player.png=z-0,0_f-webp"} />
                : <ShirtButton position={attacker[stateIndex]?.statistics[0].games.position} name={attacker[stateIndex]?.player?.name} jersey={attacker[stateIndex] ? attacker[stateIndex].jersey : "assets/no-player.png=z-0,0_f-webp"} />}

        </div>
    )
}
const substituteRowView = (localIndex, stateIndex) => {
    return (
        <>
            {isTeamSaved
                ? <BasicModal name={localStorageTeam[localIndex]?.player?.name ? localStorageTeam[localIndex]?.player?.name : substitute[stateIndex]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                : null}
            {localStorageTeam
                ? <ShirtButton isChange={isChange} setIsChange={setIsChange} onPlayerChangeHandler={onPlayerChangeHandler} localStorageTeam={localStorageTeam} position={localStorageTeam[localIndex]?.statistics[0].games.position} name={localStorageTeam[localIndex]?.player?.name} jersey={localStorageTeam[localIndex] ? localStorageTeam[localIndex].jersey : "assets/no-player.png=z-0,0_f-webp"} />
                : <ShirtButton position={substitute[stateIndex]?.statistics[0].games.position} name={substitute[stateIndex]?.player?.name} jersey={substitute[stateIndex] ? substitute[stateIndex].jersey : "assets/no-player.png=z-0,0_f-webp"} />}
        </>
    )
}
