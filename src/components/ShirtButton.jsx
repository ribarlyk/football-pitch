
export default function ShirtButton({ name, jersey, position }) {
    return (
        <button className="goalkeeer-card">
            {jersey && <img className ="card-jersey"width='100' height='100' src={jersey} alt="" />}
            <div className="player-name-container">{name}</div>
            <div className="player-position-container">{position}</div>
        </button>
    )
}


