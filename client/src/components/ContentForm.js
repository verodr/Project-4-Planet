import { useState } from 'react'

const ContentForm = ({ errors, data, handleSubmit, handleChange, categories }) => {
  console.log('After CONTENT DATA>> ', data)
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="full_name" placeholder="Name or Nickname" value={data.text.full_name} onChange={handleChange} />
      { errors.full_name && <p className="text-danger">{errors.full_name}</p> }
      <input type="text" name="location" placeholder="Location" value={data.text.location} onChange={handleChange} />
      { errors.location && <p className="text-danger">{errors.location}</p> }
      <textarea name="description" placeholder="Description" value={data.text.description} onChange={handleChange}></textarea>
      { errors.description && <p className="text-danger">{errors.description}</p> }
      <label htmlFor= "categories">Choose the category of your picture</label>
      <select name="categories">
        <option value= { categories }></option>
      </select>
      <label htmlFor="image">Picture</label>
      <input type="file" name="image" placeholder="Picture" value={data.file} onChange={handleChange} />
      { errors.image && <p className="text-danger">{errors.image}</p> } 
      <input type="submit" value="Upload" className="btn dark" />
    </form>
  )
}
export default ContentForm