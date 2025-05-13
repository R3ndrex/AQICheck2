import AddStationForm from "./AddStationForm";
import StationList from "./StationList";
export default function AddStationPage() {
    return (
        <main className="flex flex-wrap justify-center items-top mt-9">
            <AddStationForm />
            <StationList />
        </main>
    );
}
