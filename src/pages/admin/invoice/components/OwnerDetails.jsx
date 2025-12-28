export default function OwnerDetails({ form, onChange }) {
  return (
    <section className='card'>
      <h3>Owner Details</h3>
      <div className='grid'>
        <input
          name='ownerName'
          placeholder='Owner Name'
          value={form.ownerName}
          onChange={onChange}
        />
        <input
          name='mobile'
          placeholder='Mobile Number'
          value={form.mobile}
          onChange={onChange}
        />
        <input
          name='email'
          placeholder='Email (optional)'
          value={form.email}
          onChange={onChange}
        />
        <input
          name='address'
          placeholder='Address'
          value={form.address}
          onChange={onChange}
        />
      </div>
    </section>
  );
}
