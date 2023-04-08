import "./Pitch.css"
import { useEffect, useState } from "react"
import Animations from "./SkeletonPlayers"
import uniqid from "uniqid"
import ShirtButton from "./ShirtButton"

export default function Pitch() {
    const [players, setPlayers] = useState('')
    const [loading, setLoading] = useState(false)
    const [goalkeeper, setGoalkeeper] = useState([])
    const [defender, setDefender] = useState([])
    const [midfielder, setMidfielder] = useState([])
    const [attacker, setAttacker] = useState([])

    useEffect(() => {
        fetch(' https://api-football-v1.p.rapidapi.com/v3/players?league=39&season=2022', {
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


    }, [])



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
        if (player.statistics[0].games.position === 'Goalkeeper') {
            if (goalkeeper.length < 1) {
                setGoalkeeper((prev) => [...prev, player])
            }
        } else if (player.statistics[0].games.position === 'Defender') {
            if (defender.length < 4) {
                setDefender((prev) => [...prev, player])
            }
        } else if (player.statistics[0].games.position === 'Midfielder') {
            if (midfielder.length < 4) {
                setMidfielder((prev) => [...prev, player])
            }
        } else if (player.statistics[0].games.position === 'Attacker') {
            if (attacker.length < 2) {
                setAttacker((prev) => [...prev, player])
            }
        }
    }

    return (
        <>
            <div className="container">
                <div className="pitch-container">
                    <div className="pitch-background" >
                        <div className="row-one">
                            <ShirtButton />
                            <ShirtButton />
                            <ShirtButton position={goalkeeper[0]?.player?.name} jersey={goalkeeper[0] ? "assets/long-sleeve -goalkeeper.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                            <ShirtButton />
                            <ShirtButton />

                        </div>
                        <div className="row-two">
                            <div className="defender">
                                <ShirtButton className="defender" position={defender[0]?.player?.name} jersey={defender[0] ? "assets/spainwhite.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />


                            </div>
                            <div className="defender">
                                <ShirtButton className="defender" position={defender[1]?.player?.name} jersey={defender[1] ? "assets/spainwhite.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />

                            </div>
                            <div className="defender">
                                <ShirtButton className="defender" position={defender[2]?.player?.name} jersey={defender[2] ? "assets/spainwhite.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />

                            </div>
                            <div className="defender">
                                <ShirtButton className="defender" position={defender[3]?.player?.name} jersey={defender[3] ? "assets/spainwhite.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />

                            </div>
                        </div>
                        <div className="row-three">
                            <div className="midfielder">
                                <ShirtButton position={midfielder[1]?.player?.name} jersey={midfielder[1] ? "assets/spainwhite.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                            </div>
                            <div className="midfielder">
                                <ShirtButton position={midfielder[0]?.player?.name} jersey={midfielder[0] ? "assets/arsenal;.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                            </div>
                            <div className="midfielder">
                                <ShirtButton position={midfielder[2]?.player?.name} jersey={midfielder[2] ? "assets/mancity.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                            </div>
                            <div className="midfielder">
                                <ShirtButton position={midfielder[3]?.player?.name} jersey={midfielder[3] ? "assets/arsenal;.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                            </div>
                        </div>

                        <div className="row-four">
                            <div className="striker">
                                <ShirtButton position={attacker[0]?.player?.name} jersey={attacker[0] ? "assets/deutschland.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                            </div>
                            <div className="striker">
                                <ShirtButton position={attacker[1]?.player?.name} jersey={attacker[1] ? "assets/brasilyellow.png=z-0,0_f-webp" : "assets/no-player.png=z-0,0_f-webp"} />
                            </div>
                        </div>

                    </div>

                </div>
                <div className="players-container">
                    {createPlayerSection("goalkeepers", 'GOALKEEPERS', "Goalkeeper")}
                    {createPlayerSection("defenders", 'DEFENDERS', "Defender")}
                    {createPlayerSection("midfielders", 'MIDFIELDERS', "Midfielder")}
                    {createPlayerSection("attackers", 'ATTACKERS', "Attacker")}
                </div>
            </div>

        </>

    )
}