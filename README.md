# MetaMask Integration Test Project

A blockchain developer skill assessment project built with React, TypeScript, and Tailwind CSS. This project provides a UI shell for implementing MetaMask wallet integration functionality.

## 🎯 Project Overview

This is a **60-minute coding challenge** designed to test a developer's ability to implement MetaMask wallet integration. The project includes a modern, crypto-themed UI with placeholder components - **the developer needs to implement all wallet functionality**.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MetaMask browser extension

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd metamask-integration-test
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## 📋 Test Instructions

### Objective
Implement MetaMask wallet connection functionality within **60 minutes**.

### Required Features ✅

You need to implement the following core features:

- [ ] **Connect MetaMask Wallet** - Allow users to connect their MetaMask wallet
- [ ] **Disconnect Wallet** - Allow users to disconnect their wallet  
- [ ] **Display Wallet Address** - Show the connected wallet address (formatted)
- [ ] **Show Balance** - Display ETH balance of the connected wallet
- [ ] **Error Handling** - Handle common errors (no MetaMask, user rejection, etc.)
- [ ] **Network Information** - Display current network name

### Bonus Features (Optional) 🌟

Choose any of these to implement for extra points:

- [ ] **Auto-reconnect** - Remember connection state on page refresh
- [ ] **Account Changes** - Handle account/network changes in MetaMask
- [ ] **Network Switching** - Add buttons to switch between different networks
- [ ] **Transaction History** - Display recent transactions for the connected wallet
- [ ] **ERC-20 Token Support** - Show balances of popular tokens (USDC, DAI, etc.)
- [ ] **Enhanced UI/UX** - Add animations, loading states, or improved styling
- [ ] **Sign Message** - Implement message signing functionality

### Technical Requirements

- Use **TypeScript** throughout the codebase
- Implement proper **error handling** for all edge cases
- Use **React hooks** for state management
- Follow **best practices** for code organization and readability
- Ensure **responsive design** works on mobile devices

## ✅ What's Already Implemented

- ✅ Modern, responsive UI with crypto-themed design
- ✅ Complete component structure (WalletCard, TestInstructions)
- ✅ TypeScript interfaces and type definitions
- ✅ Tailwind CSS design system with custom gradients
- ✅ React Router setup
- ✅ Toast notifications system
- ✅ Error handling UI components
- ❌ **All wallet functionality needs to be implemented**

## 🛠 Project Structure

```
src/
├── components/
│   ├── WalletCard.tsx          # Main wallet component (UI only)
│   ├── TestInstructions.tsx    # Test instructions display
│   └── ui/                     # Reusable UI components
├── hooks/
│   └── useWallet.ts            # Wallet hook (TO BE IMPLEMENTED)
├── types/
│   ├── wallet.ts               # Wallet-related type definitions
│   └── ethereum.d.ts           # MetaMask type declarations
└── pages/
    └── Index.tsx               # Main page
```

## 🧪 Implementation Guide

### 1. MetaMask Detection
```typescript
// Check if MetaMask is installed
const isMetamaskInstalled = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
```

### 2. Connect Wallet
```typescript
// Request account access
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts',
});
```

### 3. Get Balance
```typescript
// Get ETH balance
const balance = await window.ethereum.request({
  method: 'eth_getBalance',
  params: [address, 'latest'],
});
```

### 4. Handle Events
```typescript
// Listen for account changes
window.ethereum.on('accountsChanged', handleAccountsChanged);
window.ethereum.on('chainChanged', handleChainChanged);
```

## 🧪 Testing Guidelines

### Manual Testing Scenarios

1. **MetaMask Not Installed**
   - Test the app without MetaMask extension
   - Should display appropriate error message

2. **Connection Flow**
   - Click "Connect Wallet" button
   - Accept connection in MetaMask popup
   - Verify wallet information displays correctly

3. **Error Handling**
   - Reject connection request
   - Test with MetaMask locked
   - Switch accounts in MetaMask

4. **Network Changes**
   - Switch networks in MetaMask
   - Verify app updates accordingly

### Evaluation Criteria

Your solution will be evaluated on:

- **Functionality** (40%) - All required features work correctly
- **Code Quality** (30%) - Clean, readable, and well-organized code
- **Error Handling** (15%) - Proper handling of edge cases and errors
- **TypeScript Usage** (10%) - Proper types and type safety
- **User Experience** (5%) - Intuitive and responsive interface

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## 🌐 Supported Networks

The app should work with:

- Ethereum Mainnet (0x1)
- Goerli Testnet (0x5)
- Sepolia Testnet (0xaa36a7)
- Polygon Mainnet (0x89)
- Mumbai Testnet (0x13881)

## 💡 Helpful Resources

- [MetaMask Developer Documentation](https://docs.metamask.io/)
- [Ethereum Provider API](https://docs.metamask.io/guide/ethereum-provider.html)
- [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) - Ethereum Provider JavaScript API

## 🚨 Common Issues & Solutions

### MetaMask Connection Issues
- Ensure MetaMask is unlocked
- Check if the website is connected in MetaMask settings
- Try refreshing the page

### Type Errors
- The project includes proper TypeScript declarations for MetaMask
- Use the provided types in `src/types/` for type safety

### Network Issues
- Some features may not work on localhost
- Use browser DevTools to debug console errors

## 📝 Submission Notes

When submitting your solution:

1. Ensure all code compiles without TypeScript errors
2. Test all functionality manually
3. Document any additional features implemented
4. Include any assumptions or design decisions made

Good luck! 🚀