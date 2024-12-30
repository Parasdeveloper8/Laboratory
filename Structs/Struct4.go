package reusable_structs

//Struct of elements with their valencies and symbols
type ElementsValAnCation struct {
	Name        string  `json:"name"`
	Atomic_Mass float64 `json:"atomic_mass"`
	Symbol      string  `json:"symbol"`
	Valency     int     `json:"valency"`
}
