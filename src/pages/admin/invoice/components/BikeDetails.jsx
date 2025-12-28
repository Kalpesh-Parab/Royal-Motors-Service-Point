const BIKE_MODELS = [
  'Old - G2 Lightening',
  'Old - G2 Tauras',
  'Old - G2',
  'Old Standard 350',
  'Old Standard 500',
  'Classic 500',
  'Classic 350',
  'Reborn 350',
  'Meteor 350',
  'Himalayan 411',
  'Himalayan 450',
  'Scram',
  'Hunter 350',
  'Guerrilla 450',
  'Meteor 650',
  'Interceptor 650',
  'Continental GT 650',
];

export default function BikeDetails({ form, onChange }) {
  const isCustomModel = form.bikeModel === 'OTHER';

  return (
    <section className='card'>
      <h3>Bike Details</h3>

      <div className='grid'>
        <input
          name='bikeNumber'
          placeholder='Bike Number'
          value={form.bikeNumber}
          onChange={onChange}
        />

        {/* BIKE MODEL DROPDOWN */}
        <select name='bikeModel' value={form.bikeModel} onChange={onChange}>
          <option value=''>Select Bike Model</option>

          {BIKE_MODELS.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}

          <option value='OTHER'>Other (Manual Entry)</option>
        </select>

        {/* CUSTOM MODEL INPUT */}
        {isCustomModel && (
          <input
            name='bikeModel'
            placeholder='Enter Bike Model'
            value={form.customBikeModel || ''}
            onChange={(e) =>
              onChange({
                target: {
                  name: 'customBikeModel',
                  value: e.target.value,
                },
              })
            }
          />
        )}

        <input
          name='bikeKms'
          placeholder='Bike KMs'
          value={form.bikeKms}
          onChange={onChange}
        />

        <input type='date' name='date' value={form.date} onChange={onChange} />

        <input
          type='time'
          name='inTime'
          value={form.inTime}
          onChange={onChange}
        />

        <input
          type='time'
          name='outTime'
          value={form.outTime}
          onChange={onChange}
        />
      </div>
    </section>
  );
}
