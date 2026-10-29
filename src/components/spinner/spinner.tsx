import './spinner.css';

function Spinner() {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner__circle" />
      <span>Loading offers...</span>
    </div>
  );
}

export default Spinner;
