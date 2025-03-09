'use client'

import { Component, ReactNode } from 'react'
import { BoundaryFallback } from '../_components/errors/BoundaryFallback.component'

interface Props {
	children: ReactNode
}

interface State {
	hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	componentDidCatch(/*error: Error, errorInfo: ErrorInfo*/) {
		return { hasError: true }
	}

	render() {
		if (this.state.hasError) return <BoundaryFallback />
		return this.props.children
	}
}
