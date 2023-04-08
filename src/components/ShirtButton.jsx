

export default function ShirtButton({ position, jersey }) {

    return (
        <button className="goalkeeer-card">
          { jersey && <img width='100' height='100' src={jersey} alt="" />}
            <div className="player-name-container">{position}</div>
        </button>
    )
}