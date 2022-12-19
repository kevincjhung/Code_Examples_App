import { useRouter } from 'next/router'
import { useState } from 'react'
import LanguageDropdown from '../components/LanguageDropdown/index.jsx'
import NavBar from '../components/NavBar/index.jsx'
import NewPostForm from '../components/NewPostForm/index.jsx'
import Button from '../components/Button/index.jsx'
import axios from 'axios'
import Head from 'next/head'

export default function AddPost() {
	const router = useRouter()

	const handleSubmit = async ({ language, code }) => {
		const { data } = await axios.post('/api/posts', {
			language,
			code
		})
		// router.push(`/posts/${data.id}`)  // use this after the post page is created
		router.push('/')
	}

	return (
		<div>
			<div className="pt-8 pb-10 lg:pt-12 lg:pb-14 max-w-5xl mx-auto px-6 my-6">
				<h1 className='text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl md:text-6xl mb-6'>Create a Snippet</h1>

				<div className='mt-6'>
					<NewPostForm className='max-w-5xl' onSubmit={handleSubmit} />
				</div>
			</div>
		</div>
	)
}
