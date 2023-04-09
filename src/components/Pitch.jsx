import "./Pitch.scss"
import { useEffect, useState } from "react"
import Animations from "./SkeletonPlayers"
import uniqid from "uniqid"
import ShirtButton from "./ShirtButton"
import PaginationOutline from "./Pagination"
import BasicModal from "./Modal"

export default function Pitch() {
    const [players, setPlayers] = useState('');
    const [loading, setLoading] = useState(false);
    const [goalkeeper, setGoalkeeper] = useState([]);
    const [defender, setDefender] = useState([]);
    const [midfielder, setMidfielder] = useState([]);
    const [attacker, setAttacker] = useState([]);
    const [page, setPage] = useState(1);
    const [budget, setBudget] = useState(450);
    const [substitue, setSubstitue] = useState([]);
    const [myTeam, setMyTeam] = useState('');
    const [isTeamChoosen, setIsTeamChoosen] = useState(!!JSON.parse(localStorage.getItem('team')));
    const [localStorageTeam, setLocalStorageTeam] = useState('');
    const [nameClass, setNameClass] = useState(false)
    useEffect(() => {
        const team = JSON.parse(localStorage.getItem('team'))
        setLocalStorageTeam(team)
    }, [])

    useEffect(() => {

        fetch(`https://api-football-v1.p.rapidapi.com/v3/players?league=39&season=2022&page=${page}`, {
            headers: {
                'X-RapidAPI-Key': '',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
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
        let sumToBuy = player.player.age || 10
        if (player.statistics[0].games.position === 'Goalkeeper') {
            if (goalkeeper.length < 1) {
                setGoalkeeper((prev) => [...prev, player])
            } else {
                setSubstitue((prev) => [...prev, player])
            }
        } else if (player.statistics[0].games.position === 'Defender') {
            if (defender.length < 4) {
                setDefender((prev) => [...prev, player])
            } else {
                setSubstitue((prev) => [...prev, player])

            }
        } else if (player.statistics[0].games.position === 'Midfielder') {
            if (midfielder.length < 4) {
                setMidfielder((prev) => [...prev, player])
            } else {
                setSubstitue((prev) => [...prev, player])

            }
        } else if (player.statistics[0].games.position === 'Attacker') {
            if (attacker.length < 2) {
                setAttacker((prev) => [...prev, player])
            } else {
                setSubstitue((prev) => [...prev, player])

            }

        }
        if (substitue.length === 4) {
            setIsTeamChoosen(true)
        }

        if (budget - sumToBuy < 0) {
            alert('not enought money')
        } else {
            setBudget((prev => Number(prev) - Number(sumToBuy)))
        }


    }


    const saveTeamHandler = () => {
        setMyTeam([...goalkeeper, ...defender, ...midfielder, ...attacker, ...substitue]);
    }

    if (myTeam.length > 0) {
        localStorage.setItem('team', JSON.stringify(myTeam));
    }

    const onPlayerChangeHandler = (e) => {
        setNameClass(e)
    }


    return (
        <>
            <div className="budget-container">
                <h2>{budget} Mil</h2>
            </div>
            <div className="container">

                <div className="pitch-container">
                    <div className="pitch-background" >
                        <div className="row-one">
                            {isTeamChoosen
                                ? <BasicModal name={goalkeeper[0]?.player?.name ? goalkeeper[0]?.player?.name : localStorageTeam[0]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                : null}
                            {localStorageTeam
                                ? <ShirtButton position={localStorageTeam[0]?.statistics[0].games.position} name={localStorageTeam[0]?.player?.name} jersey={localStorageTeam[0] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                : <ShirtButton position={goalkeeper[0]?.statistics[0].games.position} name={goalkeeper[0]?.player?.name} jersey={goalkeeper[0] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}
                        </div>
                        <div className={!nameClass ? "row-two" : "row-two-change"}>
                            <div className="defender">
                                {isTeamChoosen
                                    ? <BasicModal name={defender[0]?.player?.name ? defender[0]?.player?.name : localStorageTeam[1]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[1]?.statistics[0].games.position} name={localStorageTeam[1]?.player?.name} jersey={localStorageTeam[1] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={defender[0]?.statistics[0].games.position} name={defender[0]?.player?.name} jersey={defender[0] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                            <div className="defender">
                                {isTeamChoosen
                                    ? <BasicModal name={defender[1]?.player?.name ? defender[1]?.player?.name : localStorageTeam[2]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[2]?.statistics[0].games.position} name={localStorageTeam[2]?.player?.name} jersey={localStorageTeam[2] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={defender[1]?.statistics[0].games.position} name={defender[1]?.player?.name} jersey={defender[1] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}


                            </div>
                            <div className="defender">
                                {isTeamChoosen
                                    ? <BasicModal name={defender[2]?.player?.name ? defender[2]?.player?.name : localStorageTeam[3]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[3]?.statistics[0].games.position} name={localStorageTeam[3]?.player?.name} jersey={localStorageTeam[3] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={defender[2]?.statistics[0].games.position} name={defender[2]?.player?.name} jersey={defender[2] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                            <div className="defender">
                                {isTeamChoosen
                                    ? <BasicModal name={defender[3]?.player?.name ? defender[3]?.player?.name : localStorageTeam[4]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[4]?.statistics[0].games.position} name={localStorageTeam[4]?.player?.name} jersey={localStorageTeam[4] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={defender[3]?.statistics[0].games.position} name={defender[3]?.player?.name} jersey={defender[3] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                        </div>
                        <div className={!nameClass ? "row-three" : "row-three-change"}>
                            <div className="midfielder">
                                {isTeamChoosen
                                    ? <BasicModal name={midfielder[0]?.player?.name ? midfielder[0]?.player?.name : localStorageTeam[5]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} /> : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[5]?.statistics[0].games.position} name={localStorageTeam[5]?.player?.name} jersey={localStorageTeam[5] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={midfielder[0]?.statistics[0].games.position} name={midfielder[0]?.player?.name} jersey={midfielder[0] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                            <div className="midfielder">
                                {isTeamChoosen
                                    ? <BasicModal name={midfielder[1]?.player?.name ? midfielder[1]?.player?.name : localStorageTeam[6]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[6]?.statistics[0].games.position} name={localStorageTeam[6]?.player?.name} jersey={localStorageTeam[6] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={midfielder[1]?.statistics[0].games.position} name={midfielder[1]?.player?.name} jersey={midfielder[1] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                            <div className="midfielder">
                                {isTeamChoosen
                                    ? <BasicModal name={midfielder[2]?.player?.name ? midfielder[2]?.player?.name : localStorageTeam[7]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[7]?.statistics[0].games.position} name={localStorageTeam[7]?.player?.name} jersey={localStorageTeam[7] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={midfielder[2]?.statistics[0].games.position} name={midfielder[2]?.player?.name} jersey={midfielder[2] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                            <div className="midfielder">
                                {isTeamChoosen
                                    ? <BasicModal name={midfielder[3]?.player?.name ? midfielder[3]?.player?.name : localStorageTeam[8]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[8]?.statistics[0].games.position} name={localStorageTeam[8]?.player?.name} jersey={localStorageTeam[8] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={midfielder[3]?.statistics[0].games.position} name={midfielder[3]?.player?.name} jersey={midfielder[3] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                        </div>

                        <div className={!nameClass ? "row-four" : "row-four-change"}>
                            <div className="striker">
                                {isTeamChoosen
                                    ? <BasicModal name={attacker[0]?.player?.name ? attacker[0]?.player?.name : localStorageTeam[9]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[9]?.statistics[0].games.position} name={localStorageTeam[9]?.player?.name} jersey={localStorageTeam[9] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={attacker[0]?.statistics[0].games.position} name={attacker[0]?.player?.name} jersey={attacker[0] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                            <div className="striker">
                                {isTeamChoosen
                                    ? <BasicModal name={attacker[1]?.player?.name ? attacker[1]?.player?.name : localStorageTeam[10]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[10]?.statistics[0].games.position} name={localStorageTeam[10]?.player?.name} jersey={localStorageTeam[10] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={attacker[1]?.statistics[0].games.position} name={attacker[1]?.player?.name} jersey={attacker[1] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                        </div>

                        <div className="row-five" >
                            <div className={nameClass ? "substitute-one" : null}>
                                {isTeamChoosen
                                    ? <BasicModal name={substitue[0]?.player?.name ? substitue[0]?.player?.name : localStorageTeam[11]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[11]?.statistics[0].games.position} name={localStorageTeam[11]?.player?.name} jersey={localStorageTeam[11] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={substitue[0]?.statistics[0].games.position} name={substitue[0]?.player?.name} jersey={substitue[0] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}


                            </div>
                            <div className={nameClass ? "substitute-two" : null}>
                                {isTeamChoosen
                                    ? <BasicModal name={substitue[1]?.player?.name ? substitue[1]?.player?.name : localStorageTeam[12]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[12]?.statistics[0].games.position} name={localStorageTeam[12]?.player?.name} jersey={localStorageTeam[12] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={substitue[1]?.statistics[0].games.position} name={substitue[1]?.player?.name} jersey={substitue[1] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                            <div className={nameClass ? "substitute-three" : null}>
                                {isTeamChoosen
                                    ? <BasicModal name={substitue[2]?.player?.name ? substitue[2]?.player?.name : localStorageTeam[13]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[13]?.statistics[0].games.position} name={localStorageTeam[13]?.player?.name} jersey={localStorageTeam[13] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={substitue[2]?.statistics[0].games.position} name={substitue[2]?.player?.name} jersey={substitue[2] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                            <div className={nameClass ? "substitute-four" : null}>
                                {isTeamChoosen
                                    ? <BasicModal name={substitue[3]?.player?.name ? substitue[3]?.player?.name : localStorageTeam[14]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}
                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[14]?.statistics[0].games.position} name={localStorageTeam[14]?.player?.name} jersey={localStorageTeam[14] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={substitue[3]?.statistics[0].games.position} name={substitue[3]?.player?.name} jersey={substitue[3] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                            <div className={nameClass ? "substitute-five" : null}>
                                {isTeamChoosen
                                    ? <BasicModal name={substitue[4]?.player?.name ? substitue[4]?.player?.name : localStorageTeam[15]?.player?.name} onPlayerChangeHandler={onPlayerChangeHandler} />
                                    : null}

                                {localStorageTeam
                                    ? <ShirtButton position={localStorageTeam[15]?.statistics[0].games.position} name={localStorageTeam[15]?.player?.name} jersey={localStorageTeam[15] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                                    : <ShirtButton position={substitue[4]?.statistics[0].games.position} name={substitue[4]?.player?.name} jersey={substitue[4] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />}

                            </div>
                        </div>
                    </div>

                    {isTeamChoosen
                        ? <button onClick={() => { saveTeamHandler() }} className="save-team">Save Team</button>
                        : null}

                    {isTeamChoosen
                        ? <button className="set-captain" >Set Captain</button>
                        : null}

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