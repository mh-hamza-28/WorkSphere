import './Loader.css'

const Loader = ({ size = 'md', fullScreen = false }) => {
  const loader = (
    <div className={`loader loader-${size}`}>
      <div className="spinner"></div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        {loader}
      </div>
    )
  }

  return loader
}

export default Loader
