import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import ProjectPreview from "../components/ProjectPreview";
import type { Project, Version } from "../types/index.ts";
import api from "@/configs/axios.ts";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client.ts";

const Preview = () => {

  const {data:session, isPending} = authClient.useSession()
  const {projectId, versionId} = useParams()
  const navigate = useNavigate()
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);


  const fetchCode = async () => {
    try {
      const {data} = await api.get(`/api/project/preview/${projectId}`)
      setCode(data.project.current_code)
      if(versionId){
        data.project.versions.forEach((version : Version) => {
          if(version.id === versionId){
            setCode(version.code) 
          }
        })
      }
      setLoading(false)
    } catch (error:any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
      setLoading(false)
    }
  }

  useEffect(() => {
    // Wait for auth check to complete
    if (isPending) return;
    
    // If not authenticated, redirect to home
    if (!session?.user) {
      navigate("/")
      toast("Please Login To View your Projects")
      return;
    }
    
    // If authenticated, fetch the code
    fetchCode()
  }, [session?.user, isPending, projectId])

  // Show loading while checking auth or fetching data
  if(loading || isPending){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-indigo-200"/>
      </div>
    )
  }

  return (
    <div className="h-screen">
      {code && <ProjectPreview project={{current_code:code} as Project} isGenerating={false} showEditorPanel={false} />}
    </div>
  )
} 

export default Preview